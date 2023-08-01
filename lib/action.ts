import { ProjectForm, ProjectInterface, UserProfile } from "@/common.types";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient(apiUrl);

const makeGraphQlRequest = async (query: string, variables = {}) => {
    try {
        client.setHeader('x-api-key', apiKey)
        return await client.request(query, variables)
    } catch (error) {
        throw error;
    }
}

export const getUser = (email: string) => {
    return makeGraphQlRequest(getUserQuery, { email })
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
    const variables = {
        input: {
            name, email, avatarUrl
        }
    }
    return makeGraphQlRequest(createUserMutation, variables);
}


export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);

        return response.json();
    } catch (error) {
        throw error;
    }
}

export const uploadImage = async (imagePath: string) => {
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {
            method: "POST",
            body: JSON.stringify({
                path: imagePath,
            }),
        });

        return response.json();
    } catch (error) {
        throw error;
    }
}

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string) => {
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
        client.setHeader('Authorization', `Bearer ${token}`)
        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        };
        return makeGraphQlRequest(createProjectMutation, variables);
    }
}


export const fetchAllProjects = async (category: string | null, endCursor: string | null) => {
    return makeGraphQlRequest(projectsQuery, {
        category,
        endCursor
    });
}

export const getProjectDetails = async (id: string) => {
    return makeGraphQlRequest(getProjectByIdQuery, {
        id
    })
}

export const getUserProjects = async (id: string, last?: number) => {
    return makeGraphQlRequest(getProjectsOfUserQuery, {
        id, last
    })
}

export const deleteProject = async (id: string, token: string) => {
    client.setHeader('Authorization', `Bearer ${token}`)
    return makeGraphQlRequest(deleteProjectMutation, { id });
}

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    client.setHeader('Authorization', `Bearer ${token}`);

    function isBase64DataURL(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = { ...form };

    const isUploadingNewImage = isBase64DataURL(form.image);

    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);

        if (imageUrl.url) {
            updatedForm = {
                ...form,
                image: imageUrl.url
            }
        }
    }
    client.setHeader('Authorization', `Bearer ${token}`);
    const variables = {
        id: projectId,
        input: updatedForm,
    };

    return makeGraphQlRequest(updateProjectMutation, variables);
}