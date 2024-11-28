// "use client"

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { useToast } from '@/hooks/use-toast'
// import { useAuth } from '@/hooks/use-auth'
// import { AuthService } from '@/lib/services/client/AuthService'
// import { Link2, Loader2 } from 'lucide-react'

// interface Credentials {
//   username: string
//   password: string
//   url: string
// }

// const TEST_CREDENTIALS: Credentials = {
//   username: 'vitoasc',
//   password: '3585c59be3',
//   url: 'http://cf.mar-cdn.me'
// }

// export function Login() {
//   const router = useRouter()
//   const { toast } = useToast()
//   const { setAuth } = useAuth()
//   const [isLoading, setIsLoading] = useState(false)
//   const [showLogin, setShowLogin] = useState(false)
//   const [credentials, setCredentials] = useState<Credentials>({
//     username: '',
//     password: '',
//     url: ''
//   })

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       const result = await AuthService.login(credentials)

//       // First close the dialog and show success toast
//       setShowLogin(false)
//       toast({
//         title: "Success",
//         description: "Successfully connected to the server",
//       })

//       // Then update auth state which will trigger the redirect
//       setAuth({ ...result, credentials })
//     } catch (error) {
//       console.error('Login failed:', error)
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: error instanceof Error ? error.message : 'Login failed',
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleTestCredentials = () => {
//     setCredentials(TEST_CREDENTIALS)
//   }

//   return (
//     <>
//       <Button size="lg" onClick={() => setShowLogin(true)}>
//         <Link2 className="mr-2 h-4 w-4" />
//         Connect
//       </Button>

//       <Dialog open={showLogin} onOpenChange={setShowLogin}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Connect to Xtream Service</DialogTitle>
//             <DialogDescription>
//               Enter your Xtream credentials to access live TV channels.
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="url">Server URL</Label>
//               <Input
//                 id="url"
//                 placeholder="http://example.com:port"
//                 value={credentials.url}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, url: e.target.value }))}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="username">Username</Label>
//               <Input
//                 id="username"
//                 value={credentials.username}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                 required
//                 disabled={isLoading}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={credentials.password}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <DialogFooter className="flex-col sm:flex-row gap-2">
//               <Button
//                 type="button"
//                 variant="secondary"
//                 onClick={handleTestCredentials}
//                 disabled={isLoading}
//               >
//                 Use Test Credentials
//               </Button>
//               <div className="flex justify-end gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setShowLogin(false)}
//                   disabled={isLoading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Connecting...
//                     </>
//                   ) : (
//                     'Connect'
//                   )}
//                 </Button>
//               </div>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { AuthService } from "@/lib/services/client/AuthService";
import { Link2, Loader2 } from "lucide-react";

interface Credentials {
  username: string;
  password: string;
  url: string;
}

const TEST_CREDENTIALS: Credentials = {
  username: "vitoasc",
  password: "3585c59be3",
  url: "http://cf.mar-cdn.me",
};

export function Login() {
  const { toast } = useToast();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
    url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate URL format
      try {
        new URL(credentials.url);
      } catch {
        throw new Error(
          "Please enter a valid URL (e.g., http(s)://example.com:port)"
        );
      }

      const result = await AuthService.login(credentials);

      // First close the dialog and show success toast
      setShowLogin(false);
      toast({
        title: "Login Successful",
        description: "Welcome back! You’ve been successfully logged in.",
      });

      // Then update auth state which will trigger the redirect
      setAuth({ ...result, credentials });
    } catch (error) {
      console.error("Login failed:", error);

      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description:
          "The credentials you provided are incorrect. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCredentials = () => {
    setCredentials(TEST_CREDENTIALS);
  };

  return (
    <>
      <Button size="lg" onClick={() => setShowLogin(true)}>
        <Link2 className="mr-2 h-4 w-4" />
        Connect
      </Button>

      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect to your library</DialogTitle>
            <DialogDescription>
              Enter your credentials to load Streamhub.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Server URL</Label>
              <Input
                id="url"
                placeholder="http://example.com:port"
                value={credentials.url}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, url: e.target.value }))
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
                disabled={isLoading}
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTestCredentials}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Use Test Credentials
              </Button>
              <div className="flex justify-end gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLogin(false)}
                  disabled={isLoading}
                  className="w-full sm:w-24"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-32"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
