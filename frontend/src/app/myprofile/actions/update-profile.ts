'use server'

import { IUser } from '@/types/backend.d'
import axios from 'axios'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateUsernameSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long'),
})

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(3, 'New password must be at least 3 characters long'),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords do not match",
    path: ["confirmNewPassword"],
})

type UpdateProfileResult = {
    success: boolean
    message: string
    data?: { user?: IUser }
}

export async function updateUsername(
    prevState: UpdateProfileResult | null,
    formData: FormData,
): Promise<UpdateProfileResult> {
    const validatedFields = updateUsernameSchema.safeParse({
        username: formData.get('username'),
    })

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors[0].message }
    }

    const { username } = validatedFields.data

    const userId = formData.get('userId');
    if (!userId) {
        return { success: false, message: 'User ID is required' };
    }
    let user: IUser | undefined;
    await axios.patch(`${process.env.API_URL}/v1/users/${userId}`, { name: username }, { withCredentials: true })
        .then((res) => { user = res.data; })

    // Simulating a successful update
    revalidatePath('/myprofile')

    return {
        success: true, message: 'Username updated successfully', data: { user }
    }
}

export async function updatePassword(
    prevState: UpdateProfileResult | null,
    formData: FormData
): Promise<UpdateProfileResult> {
    const validatedFields = updatePasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmNewPassword: formData.get('confirmNewPassword'),
    })

    if (!validatedFields.success) {
        return { success: false, message: validatedFields.error.errors[0].message }
    }

    const { currentPassword, newPassword } = validatedFields.data

    const userId = formData.get('userId');
    if (!userId) {
        return { success: false, message: 'User ID is required' };
    }
    let isError = false;
    await axios.patch(`${process.env.API_URL}/v1/users/${userId}/password`, { currentPassword, newPassword }, { withCredentials: true })
        .then((res) => { console.log(res.data); })
        .catch((error) => {
            console.error('Error updating password:', error)
            isError = true;
        })
    if (isError)
        return { success: false, message: 'Incorrect current password' }
    // Simulating a successful update
    revalidatePath('/myprofile')
    return { success: true, message: 'Password updated successfully' }
}

