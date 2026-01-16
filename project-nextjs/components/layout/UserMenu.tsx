import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Settings, Shield } from 'lucide-react';

const UserMenu = () => {
    const { user, signOut, canAccessDashboard } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
    };

    if (!user) {
        return (
            <Link href="/auth">
                <Button variant="outline" size="sm">
                    লগইন
                </Button>
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback>
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name || user.email}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
                <DropdownMenuSeparator />
                {canAccessDashboard && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href="/admin">
                                <Shield className="mr-2 h-4 w-4" />
                                <span>অ্যাডমিন ড্যাশবোর্ড</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>সেটিংস</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} disabled={loading}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{loading ? 'লগআউট হচ্ছে...' : 'লগআউট'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
