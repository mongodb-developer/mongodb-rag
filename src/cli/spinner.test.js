// src/cli/spinner.test.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import MongoSpinner from './spinner.js';

jest.useFakeTimers();

describe('MongoSpinner', () => {
  let spinner;
  let originalMethods;
  let originalIsTTY;
  let originalEnv;
  let consoleLogSpy;

  beforeEach(() => {
    // Save original properties
    originalMethods = {
      clearLine: process.stdout.clearLine,
      cursorTo: process.stdout.cursorTo,
      write: process.stdout.write
    };
    originalIsTTY = process.stdout.isTTY;
    originalEnv = { ...process.env };

    // Mock stdout methods
    process.stdout.clearLine = jest.fn();
    process.stdout.cursorTo = jest.fn();
    process.stdout.write = jest.fn();
    process.stdout.isTTY = true;

    // Mock console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    // Reset environment
    delete process.env.NO_SPINNER;
    delete process.env.CI;

    spinner = new MongoSpinner();
  });

  afterEach(() => {
    // Restore original methods
    process.stdout.clearLine = originalMethods.clearLine;
    process.stdout.cursorTo = originalMethods.cursorTo;
    process.stdout.write = originalMethods.write;
    process.stdout.isTTY = originalIsTTY;
    
    // Restore environment
    process.env = originalEnv;

    // Restore console.log
    consoleLogSpy.mockRestore();

    // Clear timers
    jest.clearAllTimers();
    
    // Stop spinner if running
    if (spinner.interval) {
      spinner.stop();
    }
  });

  test('initializes with default configuration', () => {
    expect(spinner.frames).toBeDefined();
    expect(spinner.messages).toBeDefined();
    expect(spinner.isEnabled).toBe(true);
  });

  test('disables spinner in non-TTY environment', () => {
    process.stdout.isTTY = false;
    spinner = new MongoSpinner();
    expect(spinner.isEnabled).toBe(false);
  });

  test('disables spinner when NO_SPINNER env is set', () => {
    process.env.NO_SPINNER = 'true';
    spinner = new MongoSpinner();
    expect(spinner.isEnabled).toBe(false);
  });

  test('disables spinner in CI environment', () => {
    process.env.CI = 'true';
    spinner = new MongoSpinner();
    expect(spinner.isEnabled).toBe(false);
  });

  test('starts spinner in interactive environment', () => {
    spinner.start('Testing spinner');
    
    // Force the first interval tick
    jest.advanceTimersByTime(800);
    
    expect(process.stdout.write).toHaveBeenCalledWith('\n');
    expect(process.stdout.clearLine).toHaveBeenCalled();
    expect(process.stdout.cursorTo).toHaveBeenCalledWith(0);
    expect(process.stdout.write).toHaveBeenLastCalledWith(
      expect.stringContaining('Testing spinner')
    );
  });

  test('uses fallback in non-interactive environment', () => {
    process.stdout.isTTY = false;
    spinner = new MongoSpinner();
    
    spinner.start('Testing spinner');
    
    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Preparing vector magic...',
      'Testing spinner'
    );
    expect(process.stdout.write).not.toHaveBeenCalled();
  });

  test('handles missing terminal methods gracefully', () => {
    // Set method to undefined
    process.stdout.clearLine = undefined;
    
    // Create new spinner instance
    spinner = new MongoSpinner();
    
    // Should be disabled when missing required methods
    expect(spinner.isEnabled).toBe(false);
    
    // Start spinner
    spinner.start('Test');
    
    // Should use fallback logging
    expect(process.stdout.write).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  test('updates message correctly', () => {
    spinner.start('Initial message');
    jest.advanceTimersByTime(800);
    
    spinner.updateMessage('New message');
    jest.advanceTimersByTime(800);
    
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('New message')
    );
  });

  test('stops spinner and cleans up', () => {
    spinner.start('Test message');
    jest.advanceTimersByTime(800);
    
    spinner.stop(true);
    
    expect(spinner.interval).toBeNull();
    expect(process.stdout.clearLine).toHaveBeenCalled();
    expect(process.stdout.write).toHaveBeenLastCalledWith(
      expect.stringContaining('✨ Vector magic complete!')
    );
  });
});