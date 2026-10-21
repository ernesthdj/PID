<?php

declare(strict_types=1);

// Lanceur de tests minimal (PHPUnit viendra avec le squelette Laravel, T022).
// Usage : php tests/run.php

spl_autoload_register(function (string $classe): void {
    $prefixe = 'App\\';
    if (str_starts_with($classe, $prefixe)) {
        $fichier = __DIR__ . '/../src/app/' . str_replace('\\', '/', substr($classe, strlen($prefixe))) . '.php';
        if (is_file($fichier)) {
            require $fichier;
        }
    }
});

$GLOBALS['tests'] = ['ok' => 0, 'ko' => 0];

function test(string $nom, callable $f): void
{
    try {
        $f();
        $GLOBALS['tests']['ok']++;
        echo "  ok  $nom\n";
    } catch (Throwable $e) {
        $GLOBALS['tests']['ko']++;
        echo "  KO  $nom : " . $e->getMessage() . "\n";
    }
}

function assertTrue(bool $v, string $msg = 'assertion fausse'): void
{
    if (!$v) {
        throw new RuntimeException($msg);
    }
}

function assertSame($attendu, $obtenu): void
{
    if ($attendu !== $obtenu) {
        throw new RuntimeException('attendu ' . var_export($attendu, true) . ', obtenu ' . var_export($obtenu, true));
    }
}

foreach (glob(__DIR__ . '/*/*Test.php') as $fichier) {
    echo basename($fichier) . "\n";
    require $fichier;
}

echo "\n{$GLOBALS['tests']['ok']} ok, {$GLOBALS['tests']['ko']} échec(s)\n";
exit($GLOBALS['tests']['ko'] > 0 ? 1 : 0);
