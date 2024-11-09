<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StatusOnLineController extends AbstractController
{
    #[Route('/status/on/line', name: 'app_status_on_line')]
    public function index(): Response
    {
        return $this->render('status_on_line/index.html.twig', [
            'controller_name' => 'StatusOnLineController',
        ]);
    }
}
