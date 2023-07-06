<?php
namespace OCA\AudioCut\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;
use \OCP\IConfig;
use OCP\EventDispatcher\IEventDispatcher;
use OC\Files\Filesystem;


class ConversionController extends Controller {

	private $userId;

	/**
	* @NoAdminRequired
	*/
	public function __construct($AppName, IRequest $request, $UserId){
		parent::__construct($AppName, $request);
		$this->userId = $UserId;

	}

	public function getFile($directory, $fileName){
		\OC_Util::tearDownFS();
		\OC_Util::setupFS($this->userId);
		return Filesystem::getLocalFile($directory . '/' . $fileName);
	}
	/**
	* @NoAdminRequired
	*/
	public function convertHere($nameOfFile, $directory) {
		$file = $this->getFile($directory, $nameOfFile);
		$dir = dirname($file);
		$response = array();
		if (file_exists($file)){
			$cmd = $this->createCmd($file);
			$output = "";
			exec($cmd, $output,$return);
			// if the file is un external storage
			//create the new file in the NC filesystem
			Filesystem::touch($directory . '/' . pathinfo($file)['filename'].".".$type);
			//if ffmpeg is throwing an error
			if($return == 127){
				$response = array_merge($response, array("cmd" => $cmd, "code" => 0, "desc" => "ffmpeg is not installed or available"));
				return json_encode($response);
			}else{
				exec("php /var/www/nextcloud/occ files:scan ".$this->userId, $output, $return);
				$response = array_merge($response, array("cmd" => $cmd, "code" => 1));
				return json_encode($response);
			}
		}else{
			$response = array_merge($response, array("cmd" => $cmd, "code" => 0, "desc" => "Can't find file at ". $file));
			return json_encode($response);
		}
	}
	/**
	* @NoAdminRequired
	*/
	public function createCmd($file){
		$middleArgs = " -af silenceremove=stop_periods=-1:stop_duration=1:stop_threshold=-90dB";
		$cmd = " ffmpeg -y -i ".escapeshellarg($file)." ".$middleArgs." ".escapeshellarg(dirname($file) . '/' . pathinfo($file)['filename'] . "_noBlank." . pathinfo($file)['extension']);
		return $cmd;
	}
}
