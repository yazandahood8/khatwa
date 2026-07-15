import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';

/**
 * نموذج تسجيل الدخول — client-side validation, submit, redirect, and error display.
 * نموّه التنقّل ومزوّد المصادقة و API الصيانة؛ loginSchema حقيقيّ من @khatwa/shared.
 */

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  push: vi.fn(),
  params: new Map<string, string>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => ({ get: (k: string) => mocks.params.get(k) ?? null }),
}));
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
vi.mock('@/providers/auth-provider', () => ({ useAuth: () => ({ login: mocks.login }) }));
vi.mock('@/lib/api', () => ({ getMaintenance: () => Promise.resolve({ maintenance: false }) }));

beforeEach(() => {
  mocks.login.mockReset().mockResolvedValue({ id: 'u1', role: 'student' });
  mocks.push.mockReset();
  mocks.params = new Map();
});

async function fill(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('البريد الإلكتروني'), email);
  await user.type(screen.getByLabelText('كلمة السر'), password);
  await user.click(screen.getByRole('button', { name: /دخول/ }));
  return user;
}

describe('LoginPage', () => {
  it('shows a client validation error and does not call login when the password is empty', async () => {
    // بريد صالح (يمرّ من تحقّق المتصفّح لنوع email) + كلمة سرّ فارغة ⇒ يمسكها تحقّق zod.
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByLabelText('البريد الإلكتروني'), 'student@test.khatwa');
    await user.click(screen.getByRole('button', { name: /دخول/ }));

    expect(await screen.findByText(/كلمة السر مطلوبة/)).toBeInTheDocument();
    expect(mocks.login).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('will not submit a malformed email (native email validation gates login)', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);
    await user.type(screen.getByLabelText('البريد الإلكتروني'), 'not-an-email');
    await user.type(screen.getByLabelText('كلمة السر'), 'password123');
    await user.click(screen.getByRole('button', { name: /دخول/ }));

    // نوع الحقل email يمنع الإرسال، فلا نداء تسجيل دخول ولا تحويل.
    expect(mocks.login).not.toHaveBeenCalled();
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it('logs in with valid credentials and redirects to the role dashboard', async () => {
    render(<LoginPage />);
    await fill('student@test.khatwa', 'password123');

    await waitFor(() =>
      expect(mocks.login).toHaveBeenCalledWith({ email: 'student@test.khatwa', password: 'password123' }),
    );
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/dashboard'));
  });

  it('redirects an admin to the admin dashboard', async () => {
    mocks.login.mockResolvedValue({ id: 'a1', role: 'admin' });
    render(<LoginPage />);
    await fill('admin@test.khatwa', 'password123');
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/admin/dashboard'));
  });

  it('honors a callbackUrl over the default dashboard', async () => {
    mocks.params = new Map([['callbackUrl', '/courses']]);
    render(<LoginPage />);
    await fill('student@test.khatwa', 'password123');
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/courses'));
  });

  it('shows the server error message when login fails', async () => {
    mocks.login.mockRejectedValue(new Error('البريد الإلكتروني أو كلمة السر غير صحيحة'));
    render(<LoginPage />);
    await fill('student@test.khatwa', 'wrongpass');

    expect(await screen.findByText(/غير صحيحة/)).toBeInTheDocument();
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
