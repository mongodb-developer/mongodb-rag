// src/cli/spinner.test.js
import { jest, describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import MongoSpinner from './spinner.js';

jest.useFakeTimers();

describe('MongoSpinner', () => {
  let spinner;
  let originalMethods;
  let originalEnv;
  let originalIsTTY;

  beforeEach(() => {
    // Save original properties
    originalMethods = {
      clearLine: process.stdout.clearLine,
      cursorTo: process.stdout.cursorTo,
      write: process.stdout.write
    };
    originalIsTTY = process.stdout.isTTY;
    originalEnv = process.env;

    // Mock stdout methods individually
    process.stdout.clearLine = jest.fn();
    process.stdout.cursorTo = jest.fn();
    process.stdout.write = jest.fn();
    process.stdout.isTTY = true;

    // Reset process.env
    process.env = { ...originalEnv };
    
    spinner = new MongoSpinner();
  });

  afterEach(() => {
    // Stop all timers
    jest.clearAllTimers();
    
    // Restore original methods
    process.stdout.clearLine = originalMethods.clearLine;
    process.stdout.cursorTo = originalMethods.cursorTo;
    process.stdout.write = originalMethods.write;
    process.stdout.isTTY = originalIsTTY;
    process.env = originalEnv;
    
    // Ensure spinner is stopped
    spinner.stop();
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
    // Advance timers to trigger the first interval
    jest.advanceTimersByTime(100);
    
    expect(process.stdout.clearLine).toHaveBeenCalled();
    expect(process.stdout.cursorTo).toHaveBeenCalledWith(0);
    expect(process.stdout.write).toHaveBeenCalledWith(
      expect.stringContaining('Testing spinner')
    );
  });

  test('uses fallback in non-interactive environment', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    process.env.NO_SPINNER = 'true';
    spinner = new MongoSpinner();
    
    spinner.start('Testing spinner');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.any(String),
      'Testing spinner'
    );
    
    consoleSpy.mockRestore();
  });

  test('handles missing terminal methods gracefully', () => {
    // Remove clearLine method to simulate missing functionality
    process.stdout.clearLine = undefined;
    spinner = new MongoSpinner();
    expect(spinner.isEnabled).toBe(false);
  });

  test('updates message correctly', () => {
    spinner.start();
    jest.advanceTimersByTime(100);
    spinner.updateMessage('New message');
    
    expect(process.stdout.write).toHaveBeenLastCalledWith(
      expect.stringContaining('New message')
    );
  });

  test('stops spinner and cleans up', () => {
    spinner.start();
    jest.advanceTimersByTime(100);
    spinner.stop(true);
    
    expect(spinner.interval).toBeNull();
    expect(process.stdout.clearLine).toHaveBeenCalled();
  });
});