import {auth, prisma} from "@/lib/auth"
import {headers} from "next/headers"
import {NextResponse} from "next/server";

export const GET = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "microsoft"
        },
    })

    if(!account || !account.accessToken) {
        return NextResponse.json({error: "NO token"}, {status: 400})
    }

    try {
        const response = await fetch("https://graph.microsoft.com/v1.0/users", {
            headers: {
                Authorization: `Bearer ${account.accessToken}`
            }
        })

        // Admin consent validation
        if(response.status === 403) {
            const errorData = await response.json();
            if (errorData.error && errorData.error.code === "Authorization_RequestDenied") {
                return NextResponse.json({error: "Admin consent is required to access user data from Microsoft Graph"}, {status: 403})
            }
        }

        if(!response.ok) {
            return NextResponse.json({error: "Failed to fetch user data from Microsoft Graph"}, {status: response.status})
        }

        const data = await response.json();
        return NextResponse.json(data)
    } catch(error) {
        return NextResponse.json({error: "An error occurred while fetching user data from Microsoft Graph" + error}, {status: 500})
    }
}