import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { OpictuaryLogo } from "@/components/OpictuaryLogo";
import { Loader2, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { SiGoogle, SiApple } from "react-icons/si";
import { Link } from "wouter";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { login, register, isLoggingIn, isRegistering, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "",
    firstName: "", 
    lastName: "" 
  });

  const { data: socialStatus } = useQuery<{ google: boolean; apple: boolean }>({
    queryKey: ["/api/auth/social/status"],
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      const messages: Record<string, string> = {
        invalid_state: "Sign-in session expired. Please try again.",
        not_configured: "This sign-in method is not configured yet.",
        token_failed: "Could not complete sign-in. Please try again.",
        userinfo_failed: "Could not retrieve your profile. Please try again.",
        google_failed: "Google sign-in failed. Please try again.",
        apple_failed: "Apple sign-in failed. Please try again.",
        no_email: "Could not get your email. Please allow email access.",
      };
      toast({
        title: "Sign-in issue",
        description: messages[error] || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", "/auth");
    }
  }, []);

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginForm);
      toast({ title: "Welcome back!", description: "You're now signed in." });
      navigate("/");
    } catch (error: any) {
      toast({ 
        title: "Login failed", 
        description: error.message || "Please check your credentials",
        variant: "destructive" 
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "Please make sure your passwords match",
        variant: "destructive" 
      });
      return;
    }

    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName || undefined,
      });
      toast({ title: "Account created!", description: "Welcome to Opictuary." });
      navigate("/");
    } catch (error: any) {
      toast({ 
        title: "Registration failed", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAppleSignIn = () => {
    window.location.href = "/api/auth/apple";
  };

  const showSocialButtons = socialStatus?.google || socialStatus?.apple;

  const SocialButtons = () => (
    <>
      {showSocialButtons && (
        <>
          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {socialStatus?.google && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                data-testid="button-google-signin"
              >
                <SiGoogle className="h-4 w-4 mr-2" />
                Continue with Google
              </Button>
            )}
            {socialStatus?.apple && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleAppleSignIn}
                data-testid="button-apple-signin"
              >
                <SiApple className="h-4 w-4 mr-2" />
                Continue with Apple
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950 flex flex-col">
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <OpictuaryLogo variant="classic" showTagline={false} />
            </div>
            <CardTitle className="text-2xl">Welcome to Opictuary</CardTitle>
            <CardDescription>
              Honor every life, in every dimension
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="tab-login">Sign In</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                        required
                        data-testid="input-login-email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                        required
                        data-testid="input-login-password"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600"
                    disabled={isLoggingIn}
                    data-testid="button-login"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                <SocialButtons />
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstname">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-firstname"
                          type="text"
                          placeholder="First"
                          className="pl-10"
                          value={registerForm.firstName}
                          onChange={(e) => setRegisterForm(f => ({ ...f, firstName: e.target.value }))}
                          required
                          data-testid="input-register-firstname"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastname">Last Name</Label>
                      <Input
                        id="register-lastname"
                        type="text"
                        placeholder="Last"
                        value={registerForm.lastName}
                        onChange={(e) => setRegisterForm(f => ({ ...f, lastName: e.target.value }))}
                        data-testid="input-register-lastname"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                        required
                        data-testid="input-register-email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="At least 6 characters"
                        className="pl-10"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                        required
                        minLength={6}
                        data-testid="input-register-password"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="register-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        className="pl-10"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(f => ({ ...f, confirmPassword: e.target.value }))}
                        required
                        data-testid="input-register-confirm"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600"
                    disabled={isRegistering}
                    data-testid="button-register"
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <SocialButtons />
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our</p>
              <p>
                <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link>
                {" & "}
                <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
