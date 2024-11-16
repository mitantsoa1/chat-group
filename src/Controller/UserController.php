<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Friendship;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/user', name: 'api.user.')]
class UserController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/current', name: 'current', methods: ['GET'])]
    public function index(): Response
    {
        return $this->json(
            $this->getUser(),
            200,
            [],
            [AbstractNormalizer::GROUPS => ['user.read']]
        );
    }

    #[Route('/connect', name: 'connect', methods: ['POST'])]
    public function connect(HubInterface $hub): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        if ($user instanceof User) {
            // Mettre à jour le statut dans la base de données
            $user->setIsConnected(true);
            $this->entityManager->flush();

            // Publier l'événement de connexion pour chaque ami
            $friends = $this->entityManager->getRepository(User::class)
                ->findUsersInGroups();

            foreach ($friends as $friend) {
                $update = new Update(
                    sprintf('/user/%d/friends/status', $friend->getId()),
                    json_encode([
                        'userId' => $user->getId(),
                        'connected' => true
                    ])
                );
                $hub->publish($update);
            }
        }

        return $this->json(['message' => 'Connected', 'connected' => true, 'friends' => $friends, "user" => $user], 200, [], ['groups' => 'user.read']);
    }

    #[Route('/disconnect', name: 'disconnect', methods: ['POST'])]
    public function disconnect(HubInterface $hub): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
            // return $this->redirectToRoute('app_login');
        }

        if ($user instanceof User) {
            // Mettre à jour le statut dans la base de données
            $user->setIsConnected(false);
            $this->entityManager->flush();

            // Publier l'événement de déconnexion pour chaque ami
            $friends = $this->entityManager->getRepository(User::class)
                ->findUsersInGroups();

            foreach ($friends as $friend) {
                $update = new Update(
                    sprintf('/user/%d/friends/status', $friend->getId()),
                    json_encode([
                        'userId' => $user->getId(),
                        'connected' => false
                    ])
                );
                $hub->publish($update);
            }
        }

        return new JsonResponse(['message' => 'Disconnected', 'connected' => false]);
    }

    #[Route('/show/{id}', name: 'show', methods: ['GET'])]
    public function show(User $user): Response
    {
        return $this->json(
            $user,
            200,
        );
    }
}
