<?php

namespace App\Controller;

use App\Entity\Groups;
use App\Repository\GroupsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/groups', name: 'api.groups.')]
class GroupsController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(GroupsRepository $groupsRepository): Response
    {
        $groups = $groupsRepository->findGroupsWitchMember($this->getUser());

        return $this->json($groups);
    }

    #[Route('/{id}', name: 'show.notMembers', methods: ['GET'])]
    public function showNotMembers(Groups $group, GroupsRepository $groupsRepository, UserRepository $userRepository): Response
    {
        $notMembers = $groupsRepository->findUsersNotMembersGroup($group);
        $members = $groupsRepository->findUsersMembersGroup($group, $userRepository);

        return $this->json(["notMembers" => $notMembers, "members" => $members], 200);
    }

    #[Route('/add/{group}/{id}', name: 'group_add_user', methods: ['POST'])]
    public function groupAddUser(EntityManagerInterface $entityManager, int $id, int $group, UserRepository $userRepository, GroupsRepository $groupsRepository): Response
    {
        $userToAdded = $userRepository->findOneBy(['id' => $id]);
        $groupToAdded = $groupsRepository->findOneBy(['id' => $group]);

        if ($groupToAdded && $userToAdded) {
            $groupToAdded->addMember($id);
            $entityManager->persist($groupToAdded);
            $entityManager->flush();
            return $this->json($groupToAdded, Response::HTTP_OK);
        }

        return $this->json("Fatal Error");
    }
}
