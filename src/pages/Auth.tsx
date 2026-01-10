import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validation = loginSchema.safeParse({
        email: loginEmail,
        password: loginPassword,
      });

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error } = await signIn(loginEmail, loginPassword);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Welcome back!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validation = signupSchema.safeParse({
        fullName: signupName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      });

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(signupEmail, signupPassword, signupName);
      
      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0f1a]">
      {/* Back to Home Button - Fixed Position */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 via-[#0d1220] to-[#0a0f1a] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-white">WhatsFlow</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 relative z-10"
        >
          <h1 className="text-4xl font-bold leading-tight text-white">
            Enterprise WhatsApp
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">Business Platform</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-md">
            Engage customers at scale with automated messaging, AI-powered chatbots, and comprehensive analytics.
          </p>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            {[
              { label: 'Active Users', value: '50K+' },
              { label: 'Messages/Day', value: '2M+' },
              { label: 'Delivery Rate', value: '99.9%' },
              { label: 'Response Time', value: '<1s' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
              >
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-500 relative z-10"
        >
          © 2026 WhatsFlow by KeyRun Digital. All rights reserved.
        </motion.p>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0a0f1a]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-white">WhatsFlow</span>
              </div>
              <CardTitle className="text-2xl text-white">Welcome</CardTitle>
              <CardDescription className="text-gray-400">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                  <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-300">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-300">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm" className="text-gray-300">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
