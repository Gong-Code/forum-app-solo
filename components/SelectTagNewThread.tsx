'use client';

import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { ThreadTag } from '../app/types/thread';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const tags: ThreadTag[] = [
    { threadTagId: '1', tagType: 'WEB DEVELOPMENT' },
    { threadTagId: '2', tagType: 'MOBILE DEVELOPMENT' },
    { threadTagId: '3', tagType: 'DATA SCIENCE' },
    { threadTagId: '4', tagType: 'MACHINE LEARNING' },
    { threadTagId: '5', tagType: 'DEVOPS' },
    { threadTagId: '6', tagType: 'UI/UX DESIGN' },
    { threadTagId: '7', tagType: 'CYBERSECURITY' },
    { threadTagId: '8', tagType: 'CLOUD COMPUTING' },
    { threadTagId: '9', tagType: 'GAME DEVELOPMENT' },
    { threadTagId: '10', tagType: 'DATABASES' },
];

interface ComboBoxProps {
    value: ThreadTag[];
    onChange: (value: ThreadTag[]) => void;
}

export const TagComboBox = ({ value, onChange }: ComboBoxProps) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState('');

    const filteredTags = tags.filter(tag =>
        tag.tagType.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-[200px] justify-between'>
                    {value.length > 0
                        ? value.map(tag => tags.find(t => t.threadTagId === tag.threadTagId)?.tagType).join(', ')
                        : 'Select tag...'}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command>
                    <CommandInput
                        placeholder='Search tag...'
                        value={search}
                        onValueChange={setSearch}
                    />
                    <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                            {filteredTags.map((tag) => (
                                <CommandItem
                                    key={tag.threadTagId}
                                    value={tag.tagType}
                                    onSelect={() => {
                                        const newValue = value.some(v => v.threadTagId === tag.threadTagId)
                                            ? value.filter(v => v.threadTagId !== tag.threadTagId)
                                            : [...value, tag];
                                        onChange(newValue);
                                        setOpen(false);
                                    }}>
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value.some(v => v.threadTagId === tag.threadTagId)
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {tag.tagType}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};