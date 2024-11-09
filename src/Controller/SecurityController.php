<?php

namespace App\Controller;

use App\Entity\Friendship;
use App\Entity\Groups;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use App\Entity\User;
use App\Enum\FriendshipStatusEnum;
use App\Repository\FriendshipRepository;
use App\Repository\GroupsRepository;
use App\Repository\UserRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\PasswordHasher\PasswordHasherInterface;

class SecurityController extends AbstractController
{
    public function __construct(private HubInterface $hub) {}

    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $em, GroupsRepository $groupsRepository): Response
    {
        if ($this->getUser()) {
            $user = $this->getUser();
            if ($user instanceof User) {
                $update = new Update(
                    sprintf('/user/%s/friends/status', $user->getId()),
                    json_encode([
                        'userId' => $user->getId(),
                        'connected' => true
                    ])
                );
                $this->hub->publish($update);
            }
        }

        $admins          = $userRepository->findByroleadmin();

        // creation admin par defaut
        if (!$admins) {
            $user = new User();

            $user->setRoles(array('ROLE_ADMIN'));
            $user->setEmail('admin@admin.com');
            $user->setUsername('Admin');
            $user->setCreatedAt(new \DateTimeImmutable());
            $passwordcyrpter = $passwordHasher->hashPassword($user, '123456');
            $user->setPassword($passwordcyrpter);
            $em->persist($user);
            $em->flush();

            $groups = $groupsRepository->findAll();

            foreach ($groups as $group) {
                $adminMember = $groupsRepository->findIsGroupMember($group, $user->getId());
                if (!$adminMember) {
                    $group->addMember($user->getId());
                    $em->persist($user);
                    $em->flush();
                }
            }
        }


        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        // Cette méthode peut rester vide
        // La déconnexion est gérée automatiquement par Symfony
    }
}
