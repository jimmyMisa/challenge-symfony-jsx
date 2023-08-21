<?php
namespace App\Service;

use Exception;
use App\Entity\File;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

use FileValidator\FileValidator;

class FileService {

    private $em;
    private $params;

    private $project_dir;
    private $uploads_dir;
    private $images_dir;

    public function __construct(
        EntityManagerInterface $em, 
        ParameterBagInterface $params
    ){
        $this->em = $em;
        $this->params = $params;

        $this->project_dir = $params->get("project_dir");
        $this->uploads_dir = $params->get("uploads_dir");
        $this->images_dir = $params->get("images_dir");
    }

    public function uploadedFiles($file, $request)
    {
        if (!$file) {
            return [
                "status"=>500,
                "success"=>false,
                "code" => "file",
                "message" => "File does not exist"
            ];
        }
        $uploadFile = [$this, "uploadFile"];
        $transformFile = [$this, "transformFile"];
        $getResultFile = [$this, "getResultFile"];

        $main_directory = $this->project_dir;
        $sub_directory = $this->uploads_dir;
        $upload_directory = "$main_directory/$sub_directory";
        $result = [];
        $files = [];
        $isSuccess = true;
        if (is_array($file)) {
            foreach ($file as $fil) {
                if ($isSuccess) {
                    $result = $uploadFile($fil);
                }
                if (
                    $result && 
                    isset($result["status"]) && 
                    $result["status"] == 500
                ) {
                    $isSuccess = false;
                    break;
                }
                $getResultFile($result, $files);
            }
        }
        else {
            $result = $uploadFile($file);
            if (
                $result && 
                isset($result["status"]) && 
                $result["status"] == 500
            ) {
                $isSuccess = false;
            }
            $getResultFile($result, $files);

        }
        if ($isSuccess) {
            $this->em->flush();
            $resultFiles = [];
            foreach ($files as $file) {
                $resultFiles[] = $transformFile(
                    $file, 
                    $request
                );
            }
            return [
                "status"=>200,
                "success"=>true,
                "message" => "Fichier enregistré avec succés",
                "files" => $resultFiles
            ];
        }
        return [
            "status"=>500,
            "success"=>false,
            "message" => "Une erreur est survenue, veuillez réessayer plus tard."
        ];
    }

    public function getResultFile($result, &$files)
    {
        if (
            $result && 
            isset($result["file"]) && 
            $result["file"]
        ) {
            $files[]=$result["file"];
        }

        return true;
    }

    /**
     * get file type by mimetype
     * 
     * @param UploadedFile $file
     * @param boolean $not_flush
     * 
     * @return null|string
     */
    public function uploadFile(?UploadedFile $file){
        $mimetype = $file->getMimeType();
        $fileValidator = new FileValidator();
        $type = $fileValidator->getFileType($file);
        $main_directory = $this->project_dir;
        $sub_directory = $this->uploads_dir;
        $isImage = [$fileValidator,"isImage"];
        $validSize = [$fileValidator,"validSize"];
        $uploadToPath = [$fileValidator,"uploadToPath"];
        $size = $file->getSize();
    
        if(!$type){
            return [
                "status"=>500,
                "code" => "type",
                "message" => "Type de fichier n'existe pas."
            ];
        }

        if (!$isImage($mimetype) || !$validSize($size)) {
            return [
                "status"=>500,
                "code" => "type",
                // "message" => "Type de fichier n'est pas reconnu."
                "message" => "Extension or size error"
            ];
        }

        $upload_directory = "$main_directory/$sub_directory";

        if(!file_exists($upload_directory)){
            mkdir($upload_directory, 0775, true);
        }

        $file_name = uniqid().".".$file->guessExtension();

        $name = $file->getClientOriginalName();
        $original_name = $file->getClientOriginalName();

        $isSuccessUpload = $uploadToPath(
            $file,
            $upload_directory,
            $file_name
        );
        if (!$isSuccessUpload) {
            return [
                "status"=>500,
                "code" => "catch",
                "message" => "Une erreur est survenue, veuillez réessayer plus tard"
            ];
        }

        $fileEntity = new File();

        $fileEntity->setOriginalName($original_name);
        $fileEntity->setName($name);
        $fileEntity->setFileName($file_name);
        $fileEntity->setMimetype($mimetype);
        $fileEntity->setType($type);
        $fileEntity->setSize($size);

        $this->em->persist($fileEntity);

        return [
            "status" => 200,
            "message" => "Fichier enregistré avec succés",
            "file"=> $fileEntity
        ];
    }

    /**
     * remove file entity
     * 
     * @param File $file
     * @param boolean $not_flush
     * 
     * @return boolean
     */
    public function removeFile(
        ?File $file, 
        $not_flush=false
    ){
        if(!$file){
            return false;
        }

        $path = $this->getPath($file);

        if(is_file($path)){
            unlink($path);
        }

        $this->em->remove($file);

        if(!$not_flush){
            $this->em->flush();
        }

        return true;
    }

    public function getFileById($file_id)
    {
        $em = $this->em;
        $files = $em->getRepository(File::class)->findBy([
            "id" => $file_id
        ]) ;
        if ($files && isset($files[0])) {
            return $files[0];
        }
        return null;
    }

    public function transformFile(?File $file, $request)
    {
        $fileName = $file->getFileName();
        $main_directory = $this->project_dir;
        $sub_directory = $this->uploads_dir;
        $upload_directory = "$main_directory/$sub_directory";
        $file_path = "$upload_directory/$fileName";
        $url = $request->getUriForPath("/$this->images_dir/$fileName");
        $results = [
            "id"=>$file->getId(),
            "originalName"=>$file->getOriginalName(),
            "name"=>$file->getName(),
            "fileName"=>$fileName,
            "mimetype"=>$file->getMimetype(),
            "size"=>$file->getSize(),
            'path'=>$file_path,
            'url'=>$url,
        ];

        return $results;
    }

    public function getFiles($request)
    {
        $em = $this->em;
        $files = $em->getRepository(File::class)->findAll() ;
        $transformFile = [$this, "transformFile"];
        $results = [];
        foreach ($files as $file) {
            $results[] = $transformFile($file, $request);
        }
        return $results;
    }

    public function getPath(?File $file)
    {
        if(!$file){
            return null;
        }
        $main_directory = $this->project_dir;
        $sub_directory = $this->uploads_dir;
        $upload_directory = "$main_directory/$sub_directory";
        $file_name = $file->getFileName();
        $path = "$upload_directory/$file_name";

        return $path;
    }
}