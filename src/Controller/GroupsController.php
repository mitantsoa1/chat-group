<?php

namespace App\Controller;

use App\Entity\Groups;
use App\Repository\GroupsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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
            return $this->json(["group" => $groupToAdded, "member" => $userToAdded], Response::HTTP_OK);
        }

        return $this->json("Fatal Error");
    }

    #[Route('/create', name: 'create.group', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['nameGroup']) || empty($data['nameGroup'])) {
                return new JsonResponse([
                    'success' => false,
                    'message' => 'Group name is required'
                ], 400);
            }

            $group = new Groups();
            $group->setName($data['nameGroup']);
            $group->setDescription($data['descriptionGroup'] ?? null);
            $group->setMembers([1]);

            $entityManager->persist($group);
            $entityManager->flush();

            return $this->json([
                'success' => true,
                'message' => 'Group created successfully',
                'group' => $group
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'message' => 'An error occurred while creating the group'
            ], 500);
        }
    }
}
