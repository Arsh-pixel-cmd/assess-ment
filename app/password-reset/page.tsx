'use client';

export default function PasswordResetPage() {
  const handleConfirm = () => {
    // Get email from session storage
    const email = sessionStorage.getItem('reset_email');
    window.location.href = `/email-verification${email ? `?email=${email}` : ''}`;
  };

  const handleResend = () => {
    window.location.href = '/forgot-password';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-orange-500 font-bold text-2xl mb-8">Woohl</h1>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password reset</h2>
          <p className="text-gray-600 text-sm mb-8">
            Your password has been successfully reset, click confirm to set a new password
          </p>

          {/* Lock Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-orange-500" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors mb-4"
        >
          Confirm
        </button>

        <p className="text-center text-gray-600 text-sm">
          Didn&apos;t receive the link?{' '}
          <button
            onClick={handleResend}
            className="text-orange-500 hover:text-orange-600 font-medium hover:underline"
          >
            Resend
          </button>
        </p>
      </div>
    </div>
  );
}