
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, LogIn, ArrowRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import Header from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

// Define the email form schema with validation
const emailFormSchema = z.object({
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
});

// Define the verification code schema
const verificationFormSchema = z.object({
  verificationCode: z.string().min(6, {
    message: "6자리 인증코드를 모두 입력해주세요.",
  }),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState("");
  
  // Initialize email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  // Initialize verification form
  const verificationForm = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // Email submission handler
  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    // In a real implementation, this would call an API to send verification code
    setEmail(values.email);
    
    toast({
      title: "인증코드 발송",
      description: `${values.email} 주소로 인증코드가 발송되었습니다.`,
    });
    
    setStep('verification');
  };

  // Verification code submission handler
  const onVerificationSubmit = (values: z.infer<typeof verificationFormSchema>) => {
    // In a real implementation, this would validate the code against an API
    console.log("Verification code:", values.verificationCode);
    
    // For demo purposes, any 6-digit code is accepted
    toast({
      title: "로그인 성공",
      description: "인증이 완료되었습니다.",
    });
    
    // Redirect to home page after successful login
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const resendVerificationCode = () => {
    toast({
      title: "인증코드 재발송",
      description: `${email} 주소로 인증코드가 재발송되었습니다.`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
              <CardDescription className="text-center">
                {step === 'email' 
                  ? '이메일 주소를 입력하시면 인증코드를 보내드립니다'
                  : '이메일로 전송된 6자리 인증코드를 입력해주세요'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {step === 'email' ? (
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                className="pl-10" 
                                placeholder="name@example.com" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      인증코드 받기
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...verificationForm}>
                  <form onSubmit={verificationForm.handleSubmit(onVerificationSubmit)} className="space-y-4">
                    <FormField
                      control={verificationForm.control}
                      name="verificationCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>인증코드</FormLabel>
                          <FormControl>
                            <div className="flex justify-center">
                              <InputOTP
                                maxLength={6}
                                value={field.value}
                                onChange={field.onChange}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                          </FormControl>
                          <FormMessage className="text-center" />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="link" 
                        onClick={resendVerificationCode}
                        className="text-sm"
                      >
                        인증코드를 받지 못하셨나요? 재발송하기
                      </Button>
                    </div>
                    
                    <div className="text-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setStep('email')}
                        className="mx-2"
                      >
                        이메일 변경
                      </Button>
                      
                      <Button type="submit" className="mx-2">
                        <Check className="h-4 w-4 mr-2" />
                        인증 완료
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-center text-sm">
                피어몰에 처음 방문하셨나요? 로그인하시면 자동으로 계정이 생성됩니다.
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
