'use client';
import {MessageCard} from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
// import 
function UserDashBoard() {
    const [message, setMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();

    const handleDeleteMessage = (messageId) => {
        setMessage(message.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });

    const {
        register,
        watch,
        setValue,
    } = form;

    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const response = await axios.post('/api/accept-message', {
                acceptMessages,
            });

            toast({
                title: response.data.message,
            });

            setValue('acceptMessages', response.data.isAcceptingMessages);
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: error.response?.data.message,
                });
            }
        }

        setIsSwitchLoading(false);
    }, [acceptMessages, setValue, toast]);

    const fetchMessages = useCallback(async (refresh) => {
         setIsLoading(true);
         setIsSwitchLoading(false);

        try {
            const response = await axios.get('/api/get-messages');
            setMessage(response.data.messages || []);
            if (refresh) {
                toast({
                  title: 'Refreshed Messages',
                  description: 'Showing latest messages',
                });
              }
           

        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: error.response?.data.message,
                });
            }
        }finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
          }
    },[toast,setIsLoading,setMessage]);
    useEffect(() => {
        if(!session||!session.user) return;
        fetchMessages();
        fetchAcceptMessages();
    }, [fetchAcceptMessages,fetchMessages]);

    const handleSwitchChange = async () => {
        try {
          const response = await axios.post('/api/accept-messages', {
            acceptMessages: !acceptMessages,
          });
          setValue('acceptMessages', !acceptMessages);
          toast({
            title: response.data.message,
            variant: 'default',
          });
        } catch (error) {
          const axiosError = error;
          toast({
            title: 'Error',
            description:
              axiosError.response?.data.message ??
              'Failed to update message settings',
            variant: 'destructive',
          });
        }
      };
    
      if (!session || !session.user) {
        return <div></div>;
      }
    
      const { username } = session.user;
    
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const profileUrl = `${baseUrl}/u/${username}`;
    
      const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
          title: 'URL Copied!',
          description: 'Profile URL has been copied to clipboard.',
        });
      };

      return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
    
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
            <div className="flex items-center">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="input input-bordered w-full p-2 mr-2"
              />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </div>
    
          <div className="mb-4">
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? 'On' : 'Off'}
            </span>
          </div>
          <Separator />
    
          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {message.length > 0 ? (
              message.map((msg, index) => (
                <MessageCard
                  key={msg._id}
                  message={msg}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p>No messages to display.</p>
            )}
          </div>
        </div>
      );
}

export default UserDashBoard
