'use client'

import React, { useEffect, useState } from 'react'
import { updateUsername, updatePassword } from './actions/update-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Lock, BadgeCheck } from 'lucide-react'
import { IUser } from '@/types/backend.d'

interface IProp {
    user: IUser | null | undefined;
    setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
}


export function MyProfileForm(props: IProp) {
    const [usernameState, usernameAction] = React.useActionState(updateUsername, null)
    const [passwordState, passwordAction] = React.useActionState(updatePassword, null)
    const [isSubmittingUsername, setIsSubmittingUsername] = useState(false)
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

    useEffect(() => {
        if (usernameState?.success) {
            if (props.user) props.setUser({ ...props.user, name: usernameState.data?.user?.name || '' })
        }
    }, [usernameState, passwordState])

    const handleUsernameSubmit = (formData: FormData) => {
        setIsSubmittingUsername(true)
        usernameAction(formData)
        setIsSubmittingUsername(false)
    }

    const handlePasswordSubmit = (formData: FormData) => {
        setIsSubmittingPassword(true)
        passwordAction(formData)
        setIsSubmittingPassword(false)
    }

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Update Username</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleUsernameSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium">
                                <User className="w-4 h-4 inline mr-2" />
                                Username
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                defaultValue={props.user?.name || ""}
                                required
                                className="w-full"
                            />
                        </div>
                        <input type="hidden" name="userId" value={props.user?.id || 0} />
                        {usernameState?.message && (
                            <Alert variant={usernameState.success ? "default" : "destructive"}>
                                <AlertDescription>{usernameState.message}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={isSubmittingUsername}>
                            {isSubmittingUsername ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Username...
                                </>
                            ) : (
                                'Update Username'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handlePasswordSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-sm font-medium">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Current Password
                            </Label>
                            <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-sm font-medium">
                                <Lock className="w-4 h-4 inline mr-2" />
                                New Password
                            </Label>
                            <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword" className="text-sm font-medium">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Confirm New Password
                            </Label>
                            <Input
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                type="password"
                                required
                                className="w-full"
                            />
                        </div>
                        <input type="hidden" name="userId" value={props.user?.id || 0} />
                        {passwordState?.message && (
                            <Alert variant={passwordState.success ? "default" : "destructive"}>
                                <AlertDescription>{passwordState.message}</AlertDescription>
                            </Alert>
                        )}
                        <Button type="submit" className="w-full" disabled={isSubmittingPassword}>
                            {isSubmittingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Role</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <BadgeCheck className="w-6 h-6 text-primary" />
                        <div>
                            <p className="font-bold">{props.user?.role}</p>
                            <p className="text-sm text-muted-foreground">Your current role in the system</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

