<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('chat/index.html.twig', [
            'mercure_public_url' => $this->getParameter('mercure_public_url'),
            'BASE_URL' => $this->getParameter('BASE_URL'),
        ]);
    }
}
