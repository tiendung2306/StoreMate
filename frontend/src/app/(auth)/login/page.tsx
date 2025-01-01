'use client'

import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useRef, useState } from "react"

import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import axios from "axios"

export default function Login() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    function loginClicked(): void {
        axios.post(`${process.env.API_URL}/v1/auth/login`, {
            phone: phoneRef.current?.value,
            password: passwordRef.current?.value
        }, {
            withCredentials: true
        })
            .then((res) => {
                console.log(res.data);
                router.push('/dashboard');
            })
            .catch((err) => {
                alert('Invalid phone number or password');
            })
        // router.push('/dashboard')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Back button */}
                <Button variant="ghost" size="sm" className="mb-8" asChild>
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                </Button>

                {/* Login form */}
                <div className="space-y-6">
                    <h1 className="text-2xl font-semibold text-center">Log in</h1>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-600">
                                Phone number
                            </label>
                            <Input
                                type="tel"
                                placeholder="e.g. 0123456789"
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit phone number"
                                required
                                ref={phoneRef}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-gray-600">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>

                        <Button className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800" onClick={loginClicked}>
                            Log in
                        </Button>

                        <Link
                            href="/forgot-password"
                            className="block text-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            Forget your password
                        </Link>

                        <div className="text-center text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/signup" className="font-semibold hover:text-gray-900">
                                Sign up
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

