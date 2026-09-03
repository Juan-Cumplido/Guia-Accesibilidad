$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$dataPath = Join-Path $projectRoot "js\resource-data.js"
$source = Get-Content -LiteralPath $dataPath -Raw
$pattern = 'resource\("(?<type>artifact|practice)",\s*"(?<phase>[^"]+)",\s*"(?<slug>[^"]+)",\s*"(?<title>[^"]+)"'
$matches = [regex]::Matches($source, $pattern)

foreach ($match in $matches) {
  $type = $match.Groups["type"].Value
  $slug = $match.Groups["slug"].Value
  $title = $match.Groups["title"].Value
  $folderName = if ($type -eq "artifact") { "artifacts" } else { "practices" }
  $folder = Join-Path $projectRoot $folderName
  New-Item -ItemType Directory -Force -Path $folder | Out-Null
  $path = Join-Path $folder "$slug.html"
  $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0" />
  <title>$title | WAPG</title>
  <link rel="stylesheet" href="../css/styles.css" />
  <link rel="stylesheet" href="../css/site-header.css" />
  <script src="../js/translations-es.js" defer></script>
  <script src="../js/resource-translations-es.js" defer></script>
  <script src="../js/i18n.js" defer></script>
  <script src="../js/site-header.js" defer></script>
  <script src="../js/resource-data.js" defer></script>
  <script src="../js/resource-detail.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header"></header>
  <main id="main-content" class="page-shell" data-resource-detail data-resource-type="$type" data-resource-slug="$slug"></main>
</body>
</html>
"@
  Set-Content -LiteralPath $path -Value $html -Encoding UTF8
}

Write-Output "Generated $($matches.Count) resource pages."
