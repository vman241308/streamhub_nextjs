// "use client"

// import * as React from "react"
// import { useRouter } from "next/navigation"
// import { useDebounce } from "@/hooks/use-debounce"
// import { CategoryBadge } from "@/components/category-badge"
// import { Button } from "@/components/ui/button"
// import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Search as SearchIcon, Loader2 } from "lucide-react"
// import { ChannelService } from "@/lib/services/client/ChannelService"
// import type { Channel } from "@/types/xtream"
// import type { CategoryBadge as CategoryBadgeType } from "@/types/database"

// interface SearchProps {
//   serverId: number
// }

// export function Search({ serverId }: SearchProps) {
//   const router = useRouter()
//   const [isOpen, setIsOpen] = React.useState(false)
//   const [query, setQuery] = React.useState("")
//   const [isLoading, setIsLoading] = React.useState(false)
//   const [channels, setChannels] = React.useState<Channel[]>([])
//   const debouncedQuery = useDebounce(query, 300)

//   React.useEffect(() => {
//     const down = (e: KeyboardEvent) => {
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setIsOpen((open) => !open)
//       }
//     }

//     document.addEventListener("keydown", down)
//     return () => document.removeEventListener("keydown", down)
//   }, [])

//   React.useEffect(() => {
//     const searchChannels = async () => {
//       if (!debouncedQuery || debouncedQuery.length < 2) {
//         setChannels([])
//         return
//       }

//       setIsLoading(true)
//       try {
//         const results = await ChannelService.searchChannels(serverId, debouncedQuery)
//         setChannels(results)
//       } catch (error) {
//         console.error("Failed to search channels:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     searchChannels()
//   }, [debouncedQuery, serverId])

//   const handleSelect = React.useCallback((channelId: number) => {
//     setIsOpen(false)
//     router.push(`/live/watch/${channelId}`)
//   }, [router])

//   return (
//     <>
//       <Button
//         variant="outline"
//         className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-96"
//         onClick={() => setIsOpen(true)}
//       >
//         <SearchIcon className="mr-2 h-4 w-4" />
//         Search channels...
//         <kbd className="pointer-events-none absolute right-1.5 top-[50%] hidden h-5 select-none translate-y-[-50%] items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
//           <span className="text-xs">⌘</span>K
//         </kbd>
//       </Button>
//       <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
//         <CommandInput
//           placeholder="Search channels..."
//           value={query}
//           onValueChange={setQuery}
//         />
//         <div className="relative overflow-hidden">
//           <ScrollArea className="h-[300px]">
//             <CommandList>
//               <CommandEmpty className="py-6 text-center text-sm">
//                 {isLoading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     <span>Searching...</span>
//                   </div>
//                 ) : query.length < 2 ? (
//                   "Type at least 2 characters to search..."
//                 ) : (
//                   "No channels found."
//                 )}
//               </CommandEmpty>
//               {channels.length > 0 && (
//                 <CommandGroup heading="Channels">
//                   {channels.map((channel) => {
//                     const badges = channel.category_badges || []
//                     return (
//                       <CommandItem
//                         key={channel.stream_id}
//                         value={channel.name}
//                         onSelect={() => handleSelect(channel.stream_id)}
//                         className="flex items-center justify-between px-4 py-2 w-full max-w-full"
//                       >
//                         <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
//                           <span className="truncate font-medium">
//                             {channel.name}
//                           </span>
//                           <div className="flex items-center gap-2 flex-shrink-0">
//                             {badges.length > 0 && (
//                               <div className="flex gap-1">
//                                 {badges.map((badge: CategoryBadgeType, index) => (
//                                   <CategoryBadge
//                                     key={`${badge.type}-${badge.value}-${index}`}
//                                     badge={badge}
//                                   />
//                                 ))}
//                               </div>
//                             )}
//                             {channel.category_name && (
//                               <span className="text-xs text-muted-foreground">
//                                 {channel.category_name}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </CommandItem>
//                     )
//                   })}
//                 </CommandGroup>
//               )}
//             </CommandList>
//           </ScrollArea>
//         </div>
//       </CommandDialog>
//     </>
//   )
// }

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce"
import { CategoryBadge } from "@/components/category-badge"
import { Button } from "@/components/ui/button"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command"
import { 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search as SearchIcon, Loader2 } from "lucide-react"
import { ChannelService } from "@/lib/services/client/ChannelService"
import type { Channel } from "@/types/xtream"
import type { CategoryBadge as CategoryBadgeType } from "@/types/database"

interface SearchProps {
  serverId: number
}

export function Search({ serverId }: SearchProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [channels, setChannels] = React.useState<Channel[]>([])
  const debouncedQuery = useDebounce(query, 300)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const searchChannels = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setChannels([])
        return
      }

      setIsLoading(true)
      try {
        const results = await ChannelService.searchChannels(serverId, debouncedQuery)
        setChannels(results)
      } catch (error) {
        console.error("Failed to search channels:", error)
      } finally {
        setIsLoading(false)
      }
    }

    searchChannels()
  }, [debouncedQuery, serverId])

  const handleSelect = React.useCallback((channelId: number) => {
    setIsOpen(false)
    router.push(`/live/watch/${channelId}`)
  }, [router])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-96"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search channels...
        <kbd className="pointer-events-none absolute right-1.5 top-[50%] hidden h-5 select-none translate-y-[-50%] items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="sr-only">Search Channels</DialogTitle>
        <DialogDescription className="sr-only">
          Search for channels in your streaming library
        </DialogDescription>
        <CommandInput
          placeholder="Search channels..."
          value={query}
          onValueChange={setQuery}
        />
        <div className="relative overflow-hidden">
          <ScrollArea className="h-[300px]">
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                  </div>
                ) : query.length < 2 ? (
                  "Type at least 2 characters to search..."
                ) : (
                  "No channels found."
                )}
              </CommandEmpty>
              {channels.length > 0 && (
                <CommandGroup heading="Channels">
                  {channels.map((channel) => {
                    const badges = channel.category_badges || []
                    return (
                      <CommandItem
                        key={channel.stream_id}
                        value={channel.name}
                        onSelect={() => handleSelect(channel.stream_id)}
                        className="flex items-center justify-between px-4 py-2 w-full max-w-full"
                      >
                        <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
                          <span className="truncate font-medium">
                            {channel.name}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {badges.length > 0 && (
                              <div className="flex gap-1">
                                {badges.map((badge: CategoryBadgeType, index) => (
                                  <CategoryBadge
                                    key={`${badge.type}-${badge.value}-${index}`}
                                    badge={badge}
                                  />
                                ))}
                              </div>
                            )}
                            {channel.category_name && (
                              <span className="text-xs text-muted-foreground">
                                {channel.category_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </ScrollArea>
        </div>
      </CommandDialog>
    </>
  )
}