"use client"

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';

import FormField from './FormField';
import Button from './Button';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constants';
import { createNewProject, fetchToken, updateProject } from '@/lib/action';
import { FormState, ProjectInterface, SessionInterface } from '@/common.types';

type Props = {
    type: string
    session: SessionInterface
    project?: ProjectInterface

}

const ProjectForm = ({ type, session, project }: Props) => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [form, setForm] = useState<FormState>({
        title: project?.title || "",
        description: project?.description || "",
        image: project?.image || "",
        liveSiteUrl: project?.liveSiteUrl || "",
        githubUrl: project?.githubUrl || "",
        category: project?.category || ""
    });

    const handleStateChange = (fieldName: keyof FormState, value: string) => {
        setForm(prevState => ({ ...prevState, [fieldName]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.includes('image')) {
            alert('Please upload an image file');

            return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {
            const result = reader.result as string;

            handleStateChange('image', result);
        };
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        const { token } = await fetchToken();

        try {
            if (type === 'create') {
                await createNewProject(form, session?.user?.id, token);

                router.push("/")
            }

            if (type === "edit") {
                await updateProject(form, project?.id as string, token)

                router.push("/")
            }
        } catch (error) {
            alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleFormSubmit}
            className='flexStart form'
        >
            <div className='flexStart form_image-container'>
                <label htmlFor="poster" className='flexCenter form_image-label'>
                    {!form.image && 'Choose a poster form your project'}
                </label>
                <input
                    id='image'
                    type="file"
                    accept='image/*'
                    required={type === 'create'}
                    className='form_image-input'
                    onChange={handleImageChange}
                />
                {form.image && (
                    <Image
                        src={form.image}
                        className='sm:p-10 object-contain z-20'
                        alt='Project Poster'
                        fill
                    />
                )}
            </div>

            <FormField
                title="Title"
                state={form.title}
                placeholder='Flexibble'
                setState={(value) => handleStateChange('title', value)}
            />

            <FormField
                title="Description"
                state={form.description}
                placeholder='Showcase and discover remarkable developer projects.'
                setState={(value) => handleStateChange('description', value)}
            />

            <FormField
                type='url'
                title="Website URL"
                state={form.liveSiteUrl}
                placeholder='https://example.com'
                setState={(value) => handleStateChange('liveSiteUrl', value)}
            />

            <FormField
                type='url'
                title="Github URL"
                state={form.githubUrl}
                placeholder='https://github.com/username/repository'
                setState={(value) => handleStateChange('githubUrl', value)}
            />

            <CustomMenu
                title="Category"
                state={form.category}
                filters={categoryFilters}
                setState={(value) => handleStateChange('category', value)}
            />

            <div className='flexStart w-full'>
                <Button
                    type='submit'
                    title={isSubmitting ?
                        `${type === 'create' ? 'Creating' : 'Editing'}` :
                        `${type === 'create' ? 'Create' : 'Edit'}`}
                    leftIcon={isSubmitting ? "" : '/plus.svg'}
                    isSubmitting={isSubmitting}
                />
            </div>
        </form>
    )
}

export default ProjectForm