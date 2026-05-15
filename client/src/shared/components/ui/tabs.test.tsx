import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

describe('Tabs', () => {
    it('renders tabs without throwing', () => {
        render(
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Account content</TabsContent>
                <TabsContent value="password">Password content</TabsContent>
            </Tabs>
        );

        expect(screen.getByRole('tab', { name: 'Account' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Password' })).toBeInTheDocument();
    });

    it('switches content when a different tab is clicked', async () => {
        const user = userEvent.setup();

        render(
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Account content</TabsContent>
                <TabsContent value="password">Password content</TabsContent>
            </Tabs>
        );

        expect(screen.getByText('Account content')).toBeInTheDocument();
        expect(screen.queryByText('Password content')).not.toBeInTheDocument();

        await user.click(screen.getByRole('tab', { name: 'Password' }));

        expect(screen.queryByText('Account content')).not.toBeInTheDocument();
        expect(screen.getByText('Password content')).toBeInTheDocument();
    });
});
