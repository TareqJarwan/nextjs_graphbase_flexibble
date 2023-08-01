import { UserProfile } from '@/common.types'
import Profile from '@/components/Profile'
import { getUserProjects } from '@/lib/action'

type Props = {
    params: {
        id: string,
    },
}

const ProfilePage = async ({ params }: Props) => {
    const result = await getUserProjects(params.id, 100) as { user: UserProfile }

    if (!result?.user) return (
        <p className="no-result-text">Failed to fetch user info</p>
    )

    return (
        <Profile user={result?.user} />
    )
}

export default ProfilePage