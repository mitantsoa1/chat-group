<?php
namespace Deployer;

require 'recipe/symfony.php';

// Config

set('repository', 'https://github.com/mitantsoa1/chat-group.git');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts

host('159.203.94.74')
    ->set('remote_user', 'cetr-user')
    ->set('deploy_path', '~/applications/fkuzhttebh/public_html');

// Hooks

after('deploy:failed', 'deploy:unlock');
