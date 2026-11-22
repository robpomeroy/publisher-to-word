import { describe, it, expect, vi } from 'vitest';
import { verifyMwgOutput, runMwgVerification } from '../scripts/verify-mwg.mjs';

describe('Modern Web Guidance Verification (scripts/verify-mwg.mjs)', () => {
  describe('verifyMwgOutput', () => {
    it('returns success for clean output with 0 findings and exit status 0', () => {
      const output = JSON.stringify({ totalFindings: 0, guides: [] });
      const result = verifyMwgOutput(output, '', 0);
      expect(result.success).toBe(true);
      expect(result.totalFindings).toBe(0);
    });

    it('returns failure when findings are detected', () => {
      const output = JSON.stringify({ totalFindings: 3, guides: [{ name: 'dialogs' }] });
      const result = verifyMwgOutput(output, '', 0);
      expect(result.success).toBe(false);
      expect(result.totalFindings).toBe(3);
      expect(result.error).toContain('3 legacy pattern finding(s) detected');
    });

    it('returns failure when output is malformed JSON', () => {
      const result = verifyMwgOutput('not-valid-json', '', 0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('failed to parse JSON');
    });

    it('returns failure when totalFindings property is missing', () => {
      const output = JSON.stringify({ status: 'ok' });
      const result = verifyMwgOutput(output, '', 0);
      expect(result.success).toBe(false);
      expect(result.error).toContain('valid totalFindings count');
    });

    it('returns failure when process exit status is non-zero', () => {
      const output = JSON.stringify({ totalFindings: 0 });
      const result = verifyMwgOutput(output, 'warning', 1);
      expect(result.success).toBe(false);
      expect(result.error).toContain('non-zero status 1');
    });
  });

  describe('runMwgVerification', () => {
    it('executes runner and returns verification result when successful', () => {
      const mockRunner = vi.fn().mockReturnValue({
        stdout: JSON.stringify({ totalFindings: 0 }),
        stderr: '',
        status: 0
      });

      const result = runMwgVerification('src', mockRunner as unknown as typeof import('node:child_process').spawnSync);
      expect(result.success).toBe(true);
      expect(mockRunner).toHaveBeenCalled();
    });

    it('exits with status 1 when verification fails', () => {
      const mockRunner = vi.fn().mockReturnValue({
        stdout: JSON.stringify({ totalFindings: 1 }),
        stderr: 'Error occurred',
        status: 1
      });

      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {
        throw new Error('process.exit(1)');
      }) as unknown as (code?: string | number | null | undefined) => never);
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => runMwgVerification('src', mockRunner as unknown as typeof import('node:child_process').spawnSync)).toThrow('process.exit(1)');

      exitSpy.mockRestore();
      errSpy.mockRestore();
    });
  });
});
