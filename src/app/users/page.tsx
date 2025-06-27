import Header from '@/components/header';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  name: string;
  email: string;
}

export const dynamic = 'force-dynamic';

async function getUsers(): Promise<User[]> {
  try {
    const usersCollection = collection(db, "users");
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({
      name: doc.data().displayName,
      email: doc.data().email,
    }));
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
}

export default async function UsersPage() {
  const usersList = await getUsers();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 max-w-2xl mx-auto p-8 w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Users Database</h1>
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="font-semibold px-4 py-2">Name</th>
                <th className="font-semibold px-4 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-4 text-center text-muted-foreground">No users in the database yet.</td>
                </tr>
              ) : (
                usersList.map((user, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2 font-mono">{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 