// src/components/Validator/schemaValidator.js
export class ValidationResult {
    constructor(valid, message, details = []) {
      this.valid = valid;
      this.message = message;
      this.details = details;
    }
  
    static success(message, details = []) {
      return new ValidationResult(true, message, details);
    }
  
    static failure(message, details = []) {
      return new ValidationResult(false, message, details);
    }
  }
  
  export class SchemaValidator {
    constructor(schema) {
      this.schema = schema;
      this.project = schema.project;
      this.content = schema.project?.content;
    }
  
    findMappingByTable(tableName) {
      try {
        // Debug schema structure
        console.log('Schema structure:', {
          hasProject: !!this.project,
          hasContent: !!this.content,
          mappingsCount: this.content?.mappings ? Object.keys(this.content.mappings).length : 0,
          tablesCount: this.content?.tables ? Object.keys(this.content.tables).length : 0
        });
  
        // First, find all tables that match our target table name
        const matchingTables = Object.entries(this.content?.tables || {})
          .filter(([_, table]) => {
            const tablePath = table.path?.table;
            console.log('Checking table:', tablePath, 'against target:', tableName);
            return tablePath === tableName;
          });
  
        if (matchingTables.length === 0) {
          console.log('No matching tables found for:', tableName);
          return null;
        }
  
        // Get the table ID
        const [tableId] = matchingTables[0];
        console.log('Found matching table ID:', tableId);
  
        // Find all mappings for this table
        const relevantMappings = Object.entries(this.content?.mappings || {})
          .filter(([_, mapping]) => mapping.table === tableId)
          .map(([id, mapping]) => ({
            id,
            ...mapping
          }));
  
        console.log('Found mappings:', relevantMappings);
        return relevantMappings;
  
      } catch (error) {
        console.error('Error in findMappingByTable:', error);
        return null;
      }
    }
  
    validateMapping(collectionName, spec) {
      try {
        console.log('Validating mapping for:', {
          collection: collectionName,
          sourceTable: spec.source.table,
          targetField: spec.target.field
        });
  
        const mappings = this.findMappingByTable(spec.source.table);
        
        if (!mappings || mappings.length === 0) {
          return ValidationResult.failure(
            `No mapping found for table ${spec.source.table}`,
            [`Could not find any mappings for table: ${spec.source.table}`]
          );
        }
  
        // Find the relevant mapping for this collection
        const relevantMapping = mappings.find(mapping => {
          console.log('Checking mapping:', {
            settings: mapping.settings,
            targetField: spec.target.field
          });
          return mapping.settings?.type === "EMBEDDED_DOCUMENT_ARRAY" &&
                 mapping.settings?.embeddedPath === spec.target.field;
        });
  
        if (!relevantMapping) {
          return ValidationResult.failure(
            `No matching embedded array mapping found`,
            [
              `Expected: type=EMBEDDED_DOCUMENT_ARRAY, embeddedPath=${spec.target.field}`,
              'Check your mapping configuration in Relational Migrator'
            ]
          );
        }
  
        const validationDetails = [];
  
        // Validate required columns
        if (spec.source.requiredColumns) {
          const fields = relevantMapping.fields || {};
          const missingColumns = spec.source.requiredColumns.filter(col => 
            !Object.keys(fields).includes(col)
          );
  
          if (missingColumns.length > 0) {
            validationDetails.push(`Missing required columns: ${missingColumns.join(', ')}`);
          } else {
            validationDetails.push('✓ All required columns present');
          }
        }
  
        // Check embedded path configuration
        if (relevantMapping.settings?.embeddedPath === spec.target.field) {
          validationDetails.push(`✓ Correct embedded path: "${spec.target.field}"`);
        } else {
          validationDetails.push(`✗ Wrong embedded path: expected "${spec.target.field}", found "${relevantMapping.settings?.embeddedPath}"`);
        }
  
        // Check if any validation details indicate failure
        const hasFailures = validationDetails.some(detail => detail.startsWith('✗') || detail.startsWith('Missing'));
  
        return hasFailures
          ? ValidationResult.failure(`Invalid mapping configuration`, validationDetails)
          : ValidationResult.success(`Valid mapping configuration`, validationDetails);
  
      } catch (error) {
        console.error('Validation error:', error);
        return ValidationResult.failure(
          `Error validating mapping: ${error.message}`,
          [`Validation error: ${error.message}`, `Schema structure may not match expected format`]
        );
      }
    }
  }