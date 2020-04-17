import { Vector3 } from './../math/Vector3';



export abstract class MappedValues{

	private m_vector3fHashMap : Map<string, Vector3>;
	private m_floatHashMap : Map<string, number>;

	constructor(){
		this.m_vector3fHashMap = new Map<string, Vector3>();
		this.m_floatHashMap = new Map<string, number>();
	}

	public AddVector3f(name : string,  vector3f : Vector3) { this.m_vector3fHashMap.set(name, vector3f); }
	public AddFloat(name : string, floatValue : number) { this.m_floatHashMap.set(name, floatValue); }

	public GetVector3f(name : string) : Vector3{
		let result : Vector3 = this.m_vector3fHashMap.get(name);
		if(result != null)
			return result;

		return new Vector3(0,0,0);
	}

	public GetFloat(name : string) : number{
		let result : number = this.m_floatHashMap.get(name);
		if(result != null)
			return result;

		return 0;
	}
}