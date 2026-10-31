import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// نظّف الـ DOM بعد كل اختبار — unmount React trees between tests.
afterEach(() => cleanup());
