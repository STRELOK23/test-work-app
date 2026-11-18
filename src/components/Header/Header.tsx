import React from 'react';
import { Search } from 'lucide-react';
// @ts-ignore CSS imports are handled by the bundler.
import './Header.css';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <header className="header">
            <h1 className="header__title">Your tasks</h1>
            <div className="header__search">
                <Search className="header__search-icon" size={16} />
                <input
                    type="text"
                    className="header__search-input"
                    placeholder="поиск..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </header>
    );
};