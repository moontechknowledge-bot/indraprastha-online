import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, ShoppingBag, Store, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, user, updateRole, loginAsTestUser, authModalMode, sendEmailOtp, verifyEmailOtp } = useAuth();
  const [status, setStatus] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [step, setStep] = React.useState<'login' | 'otp'>('login');
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('Error: Invalid email address');
      return;
    }

    setIsProcessing(true);
    setStatus('Sending OTP...');
    try {
      await sendEmailOtp(email);
      setStatus('OTP sent to ' + email);
      setStep('otp');
      setIsProcessing(false);
    } catch (err) {
      setStatus('Error: ' + (err instanceof Error ? err.message : 'Failed to send OTP'));
      setIsProcessing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setStatus('Error: Invalid OTP');
      return;
    }
    setIsProcessing(true);
    setStatus('Verifying OTP...');
    try {
      await verifyEmailOtp(email, otp);
      // AuthContext handles redirection
    } catch (err) {
      setStatus('Error: ' + (err instanceof Error ? err.message : 'Verification failed'));
      setIsProcessing(false);
    }
  };

  const handleRoleSelection = async (role: 'buyer' | 'seller') => {
    console.log('Role selection triggered:', role);
    setIsProcessing(true);
    setStatus(`Setting you up as a ${role}...`);
    try {
      await updateRole(role);
      setStatus('Success! Redirecting...');
      setAuthModalOpen(false);
      
      // Default redirection based on role
      let targetUrl = role === 'seller' ? '/dashboard' : '/buyer-dashboard';
      
      // Check for pending plan from onboarding
      const pendingPlan = sessionStorage.getItem('pendingPlan');
      if (role === 'seller' && pendingPlan) {
        targetUrl = `/dashboard/add-business?plan=${pendingPlan}`;
        sessionStorage.removeItem('pendingPlan');
      }
      
      navigate(targetUrl);
    } catch (err) {
      console.error('Role update failed:', err);
      setStatus('Error: ' + (err instanceof Error ? err.message : 'Failed to update role'));
      setIsProcessing(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="auth-modal fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div 
        className="bg-surface/90 backdrop-blur-2xl w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Close Button */}
        <div 
          onClick={() => !isProcessing && setAuthModalOpen(false)}
          className="absolute top-6 right-6 w-12 h-12 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all z-[10] cursor-pointer flex items-center justify-center text-muted"
        >
          <X size={24} />
        </div>

        <div className="p-12">
          {!user ? (
            <div className="text-center space-y-10">
              <div className="space-y-6">
                {authModalMode !== 'seller' && (
                  <div className="flex justify-center">
                    <img 
                      src="/logo.png" 
                      alt="Indraprastha Online Logo" 
                      className="w-24 h-24 object-cover rounded-full border-2 border-primary/30 shadow-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter flex flex-wrap justify-center gap-x-2">
                    {authModalMode === 'seller' ? (
                      <span className="text-white">Seller Login</span>
                    ) : (
                      <>
                        <span className="text-[#FF9900]">इंद्रप्रस्थ</span>
                        <span className="text-[#FFFF00]">ONLINE</span>
                      </>
                    )}
                  </h2>
                  <p className="text-[#FF0000] font-bold uppercase tracking-[0.2em] text-[10px]">
                    {authModalMode === 'seller' 
                      ? 'Login to list your business' 
                      : 'Login to access your marketplace'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 py-6">
                {step === 'login' ? (
                  <>
                    <div className="w-full flex flex-col items-center gap-4 scale-110">
                      {!isProcessing ? (
                        <GoogleLogin
                          onSuccess={(credentialResponse) => {
                            console.log('AuthModal: Google Login Success, credential length:', credentialResponse.credential?.length);
                            if (credentialResponse.credential) {
                              setIsProcessing(true);
                              login(credentialResponse.credential, (newStatus) => {
                                setStatus(newStatus);
                                if (newStatus.includes('Error')) {
                                  setIsProcessing(false);
                                }
                              });
                            } else {
                              console.error('AuthModal: No credential in success response');
                              setStatus('Error: No credential received');
                            }
                          }}
                          onError={() => {
                            console.error('AuthModal: Google Login Error callback triggered');
                            setStatus('Google Login Failed');
                          }}
                          theme="filled_blue"
                          shape="pill"
                          width="250"
                          text="continue_with"
                          useOneTap={false}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-6 py-4">
                          <div className="w-24 h-24 bg-surface rounded-full p-1 shadow-2xl border-2 border-primary/50">
                            <img 
                              src="/logo.png" 
                              alt="Logo" 
                              className="w-full h-full object-contain rounded-full"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                            <p className="text-xs font-black text-primary uppercase italic tracking-widest">
                              Processing Login...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 w-full">
                      <div className="h-px bg-white/10 flex-1" />
                      <span className="text-[10px] text-muted font-bold uppercase tracking-widest">OR</span>
                      <div className="h-px bg-white/10 flex-1" />
                    </div>

                    <form onSubmit={handleSendOtp} className="w-full space-y-4">
                      <div className="relative group">
                        <input
                          type="email"
                          placeholder="Enter Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-all font-bold italic tracking-widest"
                          disabled={isProcessing}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isProcessing || !email.includes('@')}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                      >
                        {isProcessing ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Send OTP'}
                      </button>
                    </form>
                  </>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
                    <div className="text-center space-y-2">
                      <p className="text-xs text-muted font-bold uppercase tracking-widest">Enter 6-digit OTP sent to</p>
                      <p className="text-primary font-black italic tracking-widest">{email}</p>
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center text-2xl text-white placeholder:text-muted focus:outline-none focus:border-primary/50 transition-all font-black tracking-[0.5em]"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <button
                        type="submit"
                        disabled={isProcessing || otp.length < 6}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20"
                      >
                        {isProcessing ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Verify & Continue'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('login')}
                        className="text-[10px] text-muted font-bold uppercase tracking-widest hover:text-white transition-colors"
                        disabled={isProcessing}
                      >
                        Change Email Address
                      </button>
                    </div>
                  </form>
                )}

                {status && (
                  <div className="flex flex-col items-center gap-4">
                    <p className={`text-[10px] font-black uppercase italic tracking-widest px-6 py-2 rounded-full border animate-pulse ${
                      status.includes('Error') 
                        ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                        : 'text-primary bg-primary/10 border-primary/20'
                    }`}>
                      {status}
                    </p>
                    {(status.includes('Verifying') || status.includes('Setting') || isProcessing) && (
                      <div className="flex flex-col gap-3 pt-4 border-t border-white/5 w-full">
                        <p className="text-[9px] text-muted/60 font-medium animate-pulse">
                          This usually takes 2-5 seconds...
                        </p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="w-full bg-white/5 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 shadow-xl"
                        >
                          Taking too long? Reload Page
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-10 border-t border-white/5">
                <p className="text-[9px] text-muted/50 font-bold uppercase tracking-widest leading-relaxed">
                  By logging in, you agree to our <br />
                  <span className="text-white/40">Terms of Service</span> and <span className="text-white/40">Privacy Policy</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Loader2 className="text-emerald-500 animate-spin" size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Success!</h2>
                <p className="text-muted font-bold uppercase tracking-widest text-[10px]">Redirecting you now...</p>
              </div>
              
              <button 
                onClick={() => {
                  if (user) {
                    const targetUrl = user.role === 'founder' ? '/founder' : 
                                     user.role === 'seller' ? '/dashboard' : '/';
                    window.location.replace(targetUrl);
                  }
                }}
                className="text-[10px] text-muted font-bold uppercase tracking-widest underline underline-offset-4 hover:text-white transition-colors"
              >
                Taking too long? Click here to force redirect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
