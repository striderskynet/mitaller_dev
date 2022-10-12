<?php
$url = "https://ipaudio.club/wp-content/uploads/PRIME/Origin/";

for ($i = 1; $i <= 100; $i++) {
  $r = $i;
  if ($i < 10) $r = "0" . $i;
  echo "<a href=\"{$url}{$r}.mp3?_={$i}\">Capitulo {$i}</a><br> \n ";
}
