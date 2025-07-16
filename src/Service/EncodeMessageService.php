<?php
namespace App\Service; 

class EncodeMessageService
{
    private array $letterMap;

    public function __construct()
    {
        $jsonPath = __DIR__ . '/letter.json';
        $json = file_get_contents($jsonPath);
        $this->letterMap = json_decode($json, true);
    }

    public function encodeMessage(string $message): string
    {
        $result = '';
        foreach (mb_str_split($message) as $char) {
            if (isset($this->letterMap[$char])) {
                $encoded = $this->letterMap[$char];
                // Préserve la casse
                $result .= (mb_strtolower($char) === $char) ? $encoded : mb_strtoupper($encoded);
            } else {
                $result .= $char;
            }
        }
        // dd($result);
        return $result;
    }
}