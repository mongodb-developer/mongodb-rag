// tests/utils/error-handling.test.js
import { jest, describe, expect, test } from '@jest/globals';
import { wrapCommand } from '../../bin/utils/error-handling.js';

describe('Error Handling Utils', () => {
  test('wraps command and handles success', async () => {
    const mockCommand = jest.fn().mockResolvedValue('success');
    const wrapped = wrapCommand(mockCommand);
    
    const result = await wrapped();
    expect(result).toBe('success');
  });

  test('wraps command and handles error', async () => {
    const mockCommand = jest.fn().mockRejectedValue(new Error('test error'));
    const wrapped = wrapCommand(mockCommand);
    
    await expect(wrapped()).rejects.toThrow('test error');
  });
});