'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Archive, Home, Inbox, Settings, UserX } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import ChatList from '~/app/[locale]/(main)/messages/components/chat-list'
import { Nav } from '~/components/nav'
import { NetworkStatusIndicator } from '~/components/network-status'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '~/components/ui/resizable'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { TooltipProvider } from '~/components/ui/tooltip'
import useMediaQuery from '~/hooks/use-media-query'
import { usePathname } from '~/i18n/navigation'
import { cn } from '~/lib/utils'
import { LayoutProps } from '~/types/props.types'
import BlockedUsersList from '~/components/ui/chat/blocked-users-list'
import { useMessagesTranslation } from '~/hooks/use-translations'

export default function MessageLayout({ children }: LayoutProps) {
  // i18n
  const t = useMessagesTranslation()

  // routing
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // responsive
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isSmallScreen = useMediaQuery('(max-width: 1024px)')

  // sidebar collapse + layout preset
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [minLayout, setMinLayout] = useState<number[]>([20, 32, 48]) // tổng ~100

  // query state (controlled)
  const currentFilter = searchParams.get('filter') || 'all'
  const viewParam = searchParams.get('view') || 'inbox'
  const validViews = ['inbox', 'blocked-users', 'archived']
  const currentView = validViews.includes(viewParam) ? viewParam : 'inbox'

  // robust path parsing
  const pathNoQuery = (pathname || '').split('?')[0]
  const segments = pathNoQuery.split('/').filter(Boolean)
  const lastSeg = segments[segments.length - 1]
  const isInMessages = segments.includes('messages')
  const isViewingChat = isInMessages && lastSeg !== 'messages'
  const chatId = isViewingChat ? lastSeg : null

  // sync layout on breakpoint change
  useEffect(() => {
    if (isSmallScreen) {
      onCollapseCallback(true)
      setMinLayout([4, 46, 50])
    } else {
      onCollapseCallback(false)
      setMinLayout([20, 32, 48])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmallScreen])

  const onCollapseCallback = (collapsed: boolean) => {
    setIsCollapsed(collapsed)
    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(collapsed)}`
  }

  // unified push to keep locale/segment and only change query
  const pushWithQuery = (nextParams: URLSearchParams) => {
    const basePath = pathNoQuery // gồm cả /[locale]/(main)/messages[/chatId]
    router.push(`${basePath}?${nextParams.toString()}`)
  }

  const handleChangeTab = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('filter', value)
    pushWithQuery(params)
  }

  const handleNavClick = (view: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('view', view)
    pushWithQuery(params)
  }

  const getViewTitle = () => {
    switch (currentView) {
      case 'inbox':
        return t('inbox')
      case 'archived':
        return t('archive')
      case 'blocked-users':
        return t('blockedUsers')
      case 'drafts':
        return t('drafts')
      default:
        return t('inbox')
    }
  }

  // ======= MOBILE LAYOUT =======
  // Nếu là mobile và đang xem chi tiết chat → hiển thị trang chi tiết
  if (isMobile && isViewingChat) {
    return (
      <AnimatePresence mode='wait'>
        <motion.div
          key='chat-detail'
          className='flex h-full flex-col'
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    )
  }

  // Nếu là mobile và đang ở danh sách
  if (isMobile) {
    return (
      <TooltipProvider delayDuration={0}>
        <div className='flex h-full flex-col'>
          <div className='flex h-full'>
            {/* Nav trái cố định */}
            <div className='w-[60px] border-r pt-4'>
              <ScrollArea className='h-screen'>
                <div className='mt-4 flex flex-col items-center justify-center'>
                  <NetworkStatusIndicator />
                </div>
                <Nav
                  isCollapsed={true}
                  links={[
                    {
                      title: t('inbox'),
                      label: '',
                      icon: Inbox,
                      variant: currentView === 'inbox' ? 'default' : 'ghost',
                      onClick: () => handleNavClick('inbox')
                    },
                    {
                      title: t('blockedUsers'),
                      label: '',
                      icon: UserX,
                      variant: currentView === 'blocked-users' ? 'default' : 'ghost',
                      onClick: () => handleNavClick('blocked-users')
                    },
                    {
                      title: t('archive'),
                      label: '',
                      icon: Archive,
                      variant: currentView === 'archived' ? 'default' : 'ghost',
                      onClick: () => handleNavClick('archived')
                    }
                  ]}
                />
                <Separator />
                <Nav
                  isCollapsed={true}
                  links={[
                    {
                      title: t('home'),
                      label: '',
                      icon: Home,
                      variant: 'ghost',
                      href: '/'
                    },
                    {
                      title: t('settings'),
                      label: '',
                      icon: Settings,
                      variant: 'ghost',
                      href: '/settings'
                    }
                  ]}
                />
              </ScrollArea>
            </div>

            {/* Nội dung chính */}
            <div className='relative flex-1'>
              {isViewingChat ? (
                <AnimatePresence mode='wait'>
                  <motion.div
                    key='chat-detail'
                    className='bg-background absolute inset-0 z-10 flex h-full flex-col'
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <AnimatePresence mode='wait'>
                  <motion.div
                    className='flex h-full flex-col'
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  >
                    {currentView === 'blocked-users' ? (
                      <div className='flex h-full flex-col'>
                        <div className='flex items-center px-4 py-3'>
                          <h1 className='text-xl font-bold'>{getViewTitle()}</h1>
                        </div>
                        <Separator />
                        <BlockedUsersList />
                      </div>
                    ) : (
                      <Tabs value={currentFilter} onValueChange={handleChangeTab}>
                        <div className='flex items-center px-4 py-2'>
                          <h1 className='text-xl font-bold'>{getViewTitle()}</h1>
                          <TabsList className='ml-auto'>
                            <TabsTrigger
                              value='all'
                              className='text-zinc-600 dark:text-zinc-200 dark:data-[state=active]:bg-background'
                            >
                              {t('allMessages')}
                            </TabsTrigger>
                            <TabsTrigger
                              value='unread'
                              className='text-zinc-600 dark:text-zinc-200 dark:data-[state=active]:bg-background'
                            >
                              {t('unread')}
                            </TabsTrigger>
                          </TabsList>
                        </div>
                        <Separator />
                        <TabsContent value='all' className='m-0'>
                          <ChatList />
                        </TabsContent>
                        <TabsContent value='unread' className='m-0'>
                          <ChatList />
                        </TabsContent>
                      </Tabs>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    )
  }

  // ======= DESKTOP LAYOUT =======
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction='horizontal'
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:messages=${JSON.stringify(sizes)}`
        }}
        className='h-full max-h-screen items-stretch'
      >
        {/* Sidebar trái */}
        <ResizablePanel
          defaultSize={minLayout[0]}
          collapsedSize={4}
          collapsible
          minSize={isSmallScreen ? 4 : 15}
          maxSize={isSmallScreen ? 8 : 20}
          onCollapse={() => onCollapseCallback(true)}
          onExpand={() => onCollapseCallback(false)}
          className={cn('pt-4', {
            'min-w-[50px] transition-all duration-300 ease-in-out': isCollapsed,
            'border-r': isSmallScreen
          })}
        >
          <ScrollArea className='h-screen'>
            <div className='mt-4 flex flex-col items-center justify-center'>
              <NetworkStatusIndicator />
            </div>
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: t('inbox'),
                  label: '',
                  icon: Inbox,
                  variant: currentView === 'inbox' ? 'default' : 'ghost',
                  onClick: () => handleNavClick('inbox')
                },
                {
                  title: t('blockedUsers'),
                  label: '',
                  icon: UserX,
                  variant: currentView === 'blocked-users' ? 'default' : 'ghost',
                  onClick: () => handleNavClick('blocked-users')
                },
                {
                  title: t('archive'),
                  label: '',
                  icon: Archive,
                  variant: currentView === 'archived' ? 'default' : 'ghost',
                  onClick: () => handleNavClick('archived')
                }
              ]}
            />
            <Separator />
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: t('home'),
                  label: '',
                  icon: Home,
                  variant: 'ghost',
                  href: '/'
                },
                {
                  title: t('settings'),
                  label: '',
                  icon: Settings,
                  variant: 'ghost',
                  href: '/settings'
                }
              ]}
            />
          </ScrollArea>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Cột danh sách chat hoặc blocked users */}
        <ResizablePanel defaultSize={minLayout[1]} minSize={40}>
          {currentView === 'blocked-users' ? (
            <div className='flex h-full flex-col'>
              <div className='flex items-center px-4 py-3'>
                <h1 className='text-xl font-bold'>{getViewTitle()}</h1>
              </div>
              <Separator />
              <BlockedUsersList />
            </div>
          ) : (
            <Tabs value={currentFilter} onValueChange={handleChangeTab}>
              <div className='flex items-center px-4 py-2'>
                <h1 className='text-xl font-bold'>{getViewTitle()}</h1>
                <TabsList className='ml-auto'>
                  <TabsTrigger
                    value='all'
                    className='text-zinc-600 dark:text-zinc-200 dark:data-[state=active]:bg-background'
                  >
                    {t('allMessages')}
                  </TabsTrigger>
                  <TabsTrigger
                    value='unread'
                    className='text-zinc-600 dark:text-zinc-200 dark:data-[state=active]:bg-background'
                  >
                    {t('unread')}
                  </TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <TabsContent value='all' className='m-0'>
                <ChatList />
              </TabsContent>
              <TabsContent value='unread' className='m-0'>
                <ChatList />
              </TabsContent>
            </Tabs>
          )}
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Cột chi tiết chat */}
        <ResizablePanel defaultSize={minLayout[2]} minSize={35}>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
