<?php

namespace App\Controller;

use App\Entity\Groups;
use App\Repository\GroupsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api.groups.')]
class GroupsController extends AbstractController
{
    #[Route('/groups', name: 'index')]
    public function index(GroupsRepository $groupsRepository): Response
    {
        $groups = $groupsRepository->findGroupsMember($this->getUser());
        return $this->json($groups);
    }

    public function showMembers(Groups $groups) {}
}
