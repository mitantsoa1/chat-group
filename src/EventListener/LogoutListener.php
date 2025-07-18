<?php

namespace App\EventListener;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Security\Http\Event\LogoutEvent;


final class LogoutListener
{
    public function __construct(private EntityManagerInterface $entityManager) {}

    #[AsEventListener(event: LogoutEvent::class)]
    public function onLogoutEvent(LogoutEvent $event): void
    {
        $user = $event->getToken()->getUser();
        $user->setIsConnected(false);
        $user->setLastLoginAt(new \DateTimeImmutable());
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // ...
    }
}
