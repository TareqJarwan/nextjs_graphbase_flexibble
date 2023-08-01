"use client"
import React, { useEffect, useState } from 'react'
import { getProviders, signIn } from 'next-auth/react';
import Button from './Button';

type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | null;
}

type Providers = Record<string, Provider>;

const AuthProviders = () => {
    const [provides, setProvides] = useState<Providers | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();

            console.log(res);
            setProvides(res);
        }

        fetchProviders();
    }, [])


    if (provides) return (
        <div>
            {Object.values(provides).map((provider: Provider, i) => (
                <Button
                    type='button'
                    key={i}
                    handleClick={() => signIn(provider?.id)}
                    title='Sign In'
                />
            ))}
        </div>
    )
}

export default AuthProviders