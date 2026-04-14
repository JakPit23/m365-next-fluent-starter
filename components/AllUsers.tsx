"use client";
import * as React from "react";
import {
    DataGridBody,
    DataGridRow,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    DataGrid,
    createTableColumn,
    TableColumnDefinition,
    Persona,
    Spinner,
    MessageBar,
    MessageBarTitle,
    MessageBarBody,
    Input,
    Field
} from "@fluentui/react-components";
import { Search24Regular } from "@fluentui/react-icons";

type User = {
    id: string;
    displayName: string;
    mail: string;
    jobTitle: string;
    userPrincipalName: string;
};

const columns: TableColumnDefinition<User>[] = [
    createTableColumn<User>({
        columnId: "user",
        renderHeaderCell: () => "Uživatel",
        renderCell: (item) => (
            <Persona
                name={item.displayName}
                secondaryText={item.jobTitle || "Bez pozice"}
                presence={{ status: "available" }}
                size="medium"
            />
        ),
    }),
    createTableColumn<User>({
        columnId: "email",
        renderHeaderCell: () => "E-mail",
        renderCell: (item) => (
            <span style={{ color: '#0078d4', textDecoration: 'underline', cursor: 'pointer' }}>
                {item.mail || item.userPrincipalName}
            </span>
        ),
    }),
    createTableColumn<User>({
        columnId: "id",
        renderHeaderCell: () => "ID uživatele",
        renderCell: (item) => (
            <code style={{
                fontSize: '11px',
                color: '#666',
                backgroundColor: '#f5f5f5',
                padding: '2px 4px',
                borderRadius: '4px'
            }}>
                {item.id.substring(0, 8)}...
            </code>
        ),
    }),
];

export const UserTable = () => {
    const [users, setUsers] = React.useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = React.useState<User[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/graph/users");
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Error fetching users");

                const userList = Array.isArray(data) ? data : (data.value || []);
                setUsers(userList);
                setFilteredUsers(userList);
            } catch (err) {
                if(err instanceof Error) {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Logika vyhledávání
    React.useEffect(() => {
        const filtered = users.filter(u =>
            u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.mail && u.mail.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    if (loading) return <div style={{ padding: '40px' }}><Spinner label="Loading people from Entra ID..." /></div>;

    if (error) return (
        <MessageBar intent="error" style={{ margin: '20px' }}>
            <MessageBarTitle>Graph API Error</MessageBarTitle>
            <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
    );

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Field label="Search users...">
                <Input
                    contentBefore={<Search24Regular />}
                    placeholder="Jméno nebo e-mail..."
                    value={searchTerm}
                    onChange={(e, data) => setSearchTerm(data.value)}
                    style={{ maxWidth: '300px' }}
                />
            </Field>

            <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <DataGrid items={filteredUsers} columns={columns}>
                    <DataGridHeader>
                        <DataGridRow>
                            {({ renderHeaderCell }) => (
                                <DataGridHeaderCell style={{ fontWeight: 'bold' }}>
                                    {renderHeaderCell()}
                                </DataGridHeaderCell>
                            )}
                        </DataGridRow>
                    </DataGridHeader>
                    <DataGridBody<User>>
                        {({ item, rowId }) => (
                            <DataGridRow<User> key={rowId}>
                                {({ renderCell }) => (
                                    <DataGridCell>{renderCell(item)}</DataGridCell>
                                )}
                            </DataGridRow>
                        )}
                    </DataGridBody>
                </DataGrid>
                {filteredUsers.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        No users found.
                    </div>
                )}
            </div>
        </div>
    );
};