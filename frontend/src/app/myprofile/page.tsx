'use client'
import { useEffect, useState } from 'react'
import { MyProfileForm } from './my-profile-form'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/backend.d';
import { ArrowLeft } from 'lucide-react';

export default function MyProfilePage() {
    const router = useRouter();

    const [user, setUser] = useState<IUser | null>();
    useEffect(() => {
        axios.get(`${process.env.API_URL}/v1/users/status`, {
            withCredentials: true,
            headers: {
                'Cache-Control': 'no-store',
            }
        })
            .then((res) => {
                console.log(res.data);
                if (res.data.status !== "authenticated") {
                    router.push('/login');
                }
                else {

                    setUser(res.data.user);
                }
            })
    }, []);

    const dashboard = () => {
        router.push('/dashboard');
    }

    function logOut() {
        axios.get(`${process.env.API_URL}/v1/auth/logout`, { withCredentials: true })
            .then((res) => {
                router.push('/login');
                console.log(res.data);
                document.cookie.split(";").forEach((c) => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                });

                // Đặt lại trạng thái người dùng
                setUser(null);
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <div className='flex justify-between bg-white p-4 px-6'>
                <div className='cursor-pointer hover:underline' onClick={() => dashboard()}><ArrowLeft className='inline size-4' />Dashboard</div>
                <div className='cursor-pointer hover:underline' onClick={() => logOut()}>Đăng xuất</div>
            </div>
            <div className="container mx-auto px-4 py-16">
                <div className="mb-10 text-center">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full blur-lg opacity-75"></div>
                    </div>
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600">Manage your profile settings below</p>
                </div>
                <MyProfileForm user={user} setUser={setUser} />
            </div>
        </div>
    )
}

