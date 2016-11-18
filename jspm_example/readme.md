jspm install
jspm install npm:jsonp
jspm bundle-sfx --minify lib/main.js

<script type="text/javascript" src="jspm_packages/system.js"></script>
<script type="text/javascript" src="config.js"></script>
<script type="text/javascript"> 
System.import('lib/main.js');
</script>


live-server