<?php

namespace App\Controller;

use App\Entity\Friendship;
use App\Entity\User;
use App\Enum\FriendshipStatusEnum;
use App\Repository\FriendshipRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;


use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;




#[Route('/api', name: 'api.')]
class FriendController extends AbstractController
{


    #[Route('/friends', name: 'friend_user', methods: ['GET'])]
    public function friendsUser(UserRepository $userRepository, FriendshipRepository $friendshipRepository): Response
    {


        $friends = $userRepository->findAcceptedFriends($this->getUser());

        $userInfriendship = $friendshipRepository->findOneBy(["user" => $this->getUser(), "status" => FriendshipStatusEnum::ACCEPTED]);

        if (!$userInfriendship && !in_array("ROLE_ADMIN", $this->getUser()->getRoles())) {
            $friends = [];
        }

        $pendingFriends = $userRepository->findPendingFriends($this->getUser());
        $notFriends = $userRepository->findNotFriends($this->getUser(), 10);

        return $this->json(
            ['friends' => $friends, 'notFriends' => $notFriends, 'pendingFriends' => $pendingFriends],
            200,
            [],
            ['groups' => ['user.read']]
        );
    }
    #[Route('/friends/add/{id}', name: 'friend_add_user', methods: ['POST'])]
    public function friendsAddUser(EntityManagerInterface $entityManager, int $id, UserRepository $userRepository, FriendshipRepository $friendshipRepository): Response
    {
        $userToAdded = $userRepository->findOneBy(['id' => $id]);
        $existingFriendship = $friendshipRepository->findOneBy(['user' => $userToAdded]);

        if ($existingFriendship) {
            $friendship = $existingFriendship;
            $friendship->setUpdatedAt(new \DateTimeImmutable());
        } else {

            $friendship = new Friendship();
            $friendship->setCreatedAt(new \DateTimeImmutable());
        }


        $friendship->setUser($userToAdded);
        $friendship->setStatus(FriendshipStatusEnum::ACCEPTED);

        $entityManager->persist($friendship);
        $entityManager->flush();

        return $this->json(['status' => Response::HTTP_OK, 'message' => 'Friendship added successfully', 'friendship' => $friendship, 'friend' => $userToAdded], 200, [], ['groups' => 'user.read']);
    }

    #[Route('/friends/{action}/{id}', name: 'handle_friend_request', methods: ['POST'])]
    public function handleFriendRequest(
        string $action,
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        try {
            $friendship = $entityManager->getRepository(Friendship::class)->findOneBy(['user' => $this->getUser(), 'friend_id' => $id]);

            if (!$friendship) {
                throw new NotFoundHttpException('Friendship not found');
            }

            switch ($action) {
                case 'accept':
                    $friendship->setStatus(FriendshipStatusEnum::ACCEPTED);
                    break;
                case 'refuse':
                    $friendship->setStatus(FriendshipStatusEnum::REJECTED);
                    break;
                case 'block':
                    $friendship->setStatus(FriendshipStatusEnum::BLOCKED);
                    break;
                default:
                    throw new BadRequestHttpException('Invalid action');
            }

            $friendship->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->json([
                'status' => 200,
                'message' => 'Friend request ' . $action . 'ed successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
