<?php

namespace App\EventSubscriber;

use App\Event\UserRegisteredEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserRegistrationSubscriber implements EventSubscriberInterface
{
    public function __construct(private EntityManagerInterface $entityManager) {}
    public static function getSubscribedEvents(): array
    {
        return [
            UserRegisteredEvent::class => 'onUserRegistered',
        ];
    }

    public function onUserRegistered(UserRegisteredEvent $event): void
    {
        $user = $event->getUser();

        $now = new \DateTimeImmutable();
        $user->setCreatedAt($now);
        $user->setLastLoginAt($now);
        $user->setIsConnected(true);
        $entityManager->persist($user);
        $this->entityManager->flush();
    }
}
