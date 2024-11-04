"use client";
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {useParams, useRouter} from 'next/navigation';
import {useToast} from '@/hooks/use-toast';
import axios, {AxiosError} from 'axios';
import {Loader2} from 'lucide-react';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import { verifySchema } from '../../../../Schemas/verifySchema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useState } from 'react';
export default function Verify() {
    const router=useRouter();
    const params=useParams();
    const {toast}=useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form=useForm({
        resolver:zodResolver(verifySchema)
    });

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            console.log(data, params.username);
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });
            toast({
                title: 'Success',
                description: response.data.message
            });
            router.replace('/sign-in');
        } catch (error) {
            console.error('Error during sign-up:', error);
            const axiosError = error;
            // Default error message
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Verification Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">Enter the verification code sent to your email</p>
          </div>
            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </form>
        </Form>

        </div>
      </div>
    )
               

}