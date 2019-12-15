import { Texture } from './../graphics/Texture';
import { MappedValues } from "./MappedValues";

export class Material extends MappedValues
{
	private  m_textureHashMap : Map<string, Texture>;

	constructor(diffuse : Texture, specularIntensity : number,  specularPower : number, normal : Texture,
	             dispMap : Texture, dispMapScale : number, dispMapOffset : number)
	{
		super();
		this.m_textureHashMap = new Map<string, Texture>();
		this.AddTexture("diffuse", diffuse);
		this.AddFloat("specularIntensity", specularIntensity);
		this.AddFloat("specularPower", specularPower);
		this.AddTexture("normalMap", normal);
		this.AddTexture("dispMap", dispMap);

		let baseBias : number = dispMapScale/2.0;
		this.AddFloat("dispMapScale", dispMapScale);
		this.AddFloat("dispMapBias", -baseBias + baseBias * dispMapOffset);
	}

	public AddTexture( name : string,  texture : Texture) : void { 
        this.m_textureHashMap.set(name, texture); 
    }

	public GetTexture(name : string) : Texture{
		let result : Texture = this.m_textureHashMap.get(name);
		if(result != null)
			return result;

		return new Texture("test.png");
	}
}
