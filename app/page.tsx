"use client";
import { Button, Persona, Title2, Divider, makeStyles, tokens } from "@fluentui/react-components";
import { authClient } from "@/lib/auth-client";
import { UserTable } from "@/components/AllUsers";

// Fluent UI doporučuje definovat styly přes makeStyles pro nejlepší kompatibilitu
const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        backgroundColor: tokens.colorNeutralBackground2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    header: {
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px",
        backgroundColor: tokens.colorNeutralBackground1,
        borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
        boxSizing: "border-box",
    },
    main: {
        width: "100%",
        maxWidth: "1200px",
        padding: "40px 20px",
    },
    card: {
        backgroundColor: tokens.colorNeutralBackground1,
        padding: "24px",
        borderRadius: tokens.borderRadiusLg,
        boxShadow: tokens.shadow4,
    },
    authButtons: {
        display: "flex",
        gap: "12px",
    }
});

export default function Home() {
    const { data: session } = authClient.useSession();
    const styles = useStyles();

    const handleSignIn = async () => {
        await authClient.signIn.social({
            provider: "microsoft",
            callbackURL: "/",
        });
    };

    return (
        <div className={styles.root}>
            {/* Navigace */}
            <header className={styles.header}>
                <Title2>M365 Starter Pack</Title2>

                <div className={styles.authButtons}>
                    {!session ? (
                        <Button appearance="primary" onClick={handleSignIn}>
                            Login using Entra ID
                        </Button>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <Persona
                                name={session.user.name}
                                secondaryText={session.user.email}
                                presence={{ status: "available" }}
                                avatar={{ src: session.user.image }}
                            />
                            <Button size="small" appearance="subtle" onClick={() => authClient.signOut()}>
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            {/* Obsah */}
            <main className={styles.main}>
                {session ? (
                    <div className={styles.card}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>User management</h3>
                        <Divider style={{ marginBottom: '20px' }} />
                        <UserTable />
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <h2 style={{ color: tokens.colorNeutralForeground4 }}>Welcome in your M365 App</h2>
                        <p style={{ color: tokens.colorNeutralForeground4 }}>Please log in to view data from Graph API</p>
                    </div>
                )}
            </main>
        </div>
    );
}