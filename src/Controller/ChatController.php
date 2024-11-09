<?php

namespace App\Controller;

use App\Entity\Message;
use App\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\MessageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use App\Repository\UserRepository;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class ChatController extends AbstractController
{
    private string $mercurePublicUrl;
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;

    public function __construct(
        SerializerInterface $serializer,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ParameterBagInterface $parameter,
        string $mercurePublicUrl
    ) {
        $this->mercurePublicUrl = $mercurePublicUrl;
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    #[Route('/api/chat/send/{id}', name: 'chat_send', methods: ['POST'])]
    public function send(Request $request, HubInterface $hub, int $id, TokenInterface $token): JsonResponse
    {
        $chatMessage = new Message();
        $data = json_decode($request->getContent(), true);
        $message = $data['message'] ?? '';

        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], 401);
        }

        // Vérifiez si $user est un tableau ou un objet User
        if (is_array($user)) {
            $userId = $user['id'] ?? null;
        } elseif ($user instanceof User) {
            $userId = $user->getId();
        } else {
            return $this->json(['error' => 'Invalid user data'], 500);
        }

        if (!$userId) {
            return $this->json(['error' => 'Unable to get user ID'], 500);
        }


        $chatMessage->setUser($user);
        $chatMessage->setBody($message);
        $chatMessage->setCreatedAt(new \DateTimeImmutable());
        $chatMessage->addSendTo($id);

        $this->entityManager->persist($chatMessage);
        $this->entityManager->flush();


        $messageData = [
            'message' => [
                'id' => $chatMessage->getId(),
                'body' => $chatMessage->getBody(),
                'user_id' => $userId,
                'created_at' => $chatMessage->getCreatedAt()->format('c'),
                'send_to' => json_decode($id, true)
            ],
            'user' => [
                'id' => $userId,
                'email' => $user->getEmail(),
                'roles' => $this->getUser()->getRoles(),
                'username' => $this->getUser()->getUsername(),
            ]
        ];

        $update = new Update(
            'chat',
            json_encode(['message' => $messageData])
        );
        $hub->publish($update);

        return $this->json($messageData);
    }

    #[Route('/api/chat/send/{id}', name: 'chat_send_preflight', methods: ['OPTIONS'])]
    public function sendPreflight(): Response
    {
        $response = new Response();
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        return $response;
    }

    #[Route('/api/chat/messages/{groupId}', name: 'app_chat_messages', methods: ['GET'])]
    public function getMessages(Request $request, MessageRepository $messageRepository, $groupId): JsonResponse
    {
        $user = $this->getUser();

        if (!$user || !$groupId) {
            return $this->json(['error' => 'User not authenticated or friend ID not provided'], 400);
        }

        $messages = $messageRepository->findMessagesWithSendTo($user, $groupId);

        return $this->json($messages);
    }

    #[Route('/chat', name: 'app_chat')]
    public function index(): Response
    {
        return $this->redirectToRoute('index');
    }

    // #[Route('/api/chat/friends/{id}', name: 'app_chat_friends', methods: ['GET'])]
    // public function getFriends(int $id, UserRepository $userRepository): JsonResponse
    // {
    //     $friends = $userRepository->findFriends($id);

    //     // Transformer les amis pour inclure leur statut de connexion
    //     $friendsArray = array_map(function ($friend) {
    //         return [
    //             'id' => $friend->getId(),
    //             'username' => $friend->getUsername(),
    //             'email' => $friend->getEmail(),
    //             'isConnected' => $friend->isConnected() // Assurez-vous que cette méthode existe
    //         ];
    //     }, $friends);

    //     return $this->json([
    //         'friends' => $friendsArray,
    //         // ... reste du code
    //     ]);
    // }
}
