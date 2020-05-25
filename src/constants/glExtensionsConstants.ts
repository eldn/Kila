export let glExtensionsConstant = {
    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 0x88FE, //  Describes the frequency divisor used for instanced rendering.
    UNMASKED_VENDOR_WEBGL: 0x9245, //  Passed to getParameter to get the vendor string of the graphics driver.
    UNMASKED_RENDERER_WEBGL: 0x9246, //  Passed to getParameter to get the renderer string of the graphics driver.
    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 0x84FF, //  Returns the maximum available anisotropy.
    TEXTURE_MAX_ANISOTROPY_EXT: 0x84FE, //  Passed to texParameter to set the desired maximum anisotropy for a texture.
    COMPRESSED_RGB_S3TC_DXT1_EXT: 0x83F0, //  A DXT1-compressed image in an RGB image format.
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 0x83F1, //  A DXT1-compressed image in an RGB image format with a simple on/off alpha value.
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 0x83F2, //  A DXT3-compressed image in an RGBA image format. Compared to a 32-bit RGBA texture, it offers 4:1 compression.
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 0x83F3, //  A DXT5-compressed image in an RGBA image format. It also provides a 4:1 compression, but differs to the DXT3 compression in how the alpha compression is done.
    COMPRESSED_R11_EAC: 0x9270, //  One-channel (red) unsigned format compression.
    COMPRESSED_SIGNED_R11_EAC: 0x9271, //  One-channel (red) signed format compression.
    COMPRESSED_RG11_EAC: 0x9272, //  Two-channel (red and green) unsigned format compression.
    COMPRESSED_SIGNED_RG11_EAC: 0x9273, //  Two-channel (red and green) signed format compression.
    COMPRESSED_RGB8_ETC2: 0x9274, //  Compresses RBG8 data with no alpha channel.
    COMPRESSED_RGBA8_ETC2_EAC: 0x9275, //  Compresses RGBA8 data. The RGB part is encoded the same as RGB_ETC2, but the alpha part is encoded separately.
    COMPRESSED_SRGB8_ETC2: 0x9276, //  Compresses sRBG8 data with no alpha channel.
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 0x9277, //  Compresses sRGBA8 data. The sRGB part is encoded the same as SRGB_ETC2, but the alpha part is encoded separately.
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9278, //  Similar to RGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 0x9279, //  Similar to SRGB8_ETC, but with ability to punch through the alpha channel, which means to make it completely opaque or transparent.
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 0x8C00, //  RGB compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 0x8C02, //  RGBA compression in 4-bit mode. One block for each 4×4 pixels.
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 0x8C01, //  RGB compression in 2-bit mode. One block for each 8×4 pixels.
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 0x8C03, //  RGBA compression in 2-bit mode. One block for each 8×4 pixe
    COMPRESSED_RGB_ETC1_WEBGL: 0x8D64, //  Compresses 24-bit RGB data with no alpha channel.
    COMPRESSED_RGB_ATC_WEBGL: 0x8C92, //  Compresses RGB textures with no alpha channel.
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 0x8C92, //  Compresses RGBA textures using explicit alpha encoding (useful when alpha transitions are sharp).
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 0x87EE, //  Compresses RGBA textures using interpolated alpha encoding (useful when alpha transitions are gradient).
    UNSIGNED_INT_24_8_WEBGL: 0x84FA, //  Unsigned integer type for 24-bit depth texture data.
    HALF_FLOAT_OES: 0x8D61, //  Half floating-point type (16-bit).
    RGBA32F_EXT: 0x8814, //  RGBA 32-bit floating-point color-renderable format.
    RGB32F_EXT: 0x8815, //  RGB 32-bit floating-point color-renderable format.
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 0x8211, //   
    UNSIGNED_NORMALIZED_EXT: 0x8C17, //   
    MIN_EXT: 0x8007, //  Produces the minimum color components of the source and destination colors.
    MAX_EXT: 0x8008, //  Produces the maximum color components of the source and destination colors.
    SRGB_EXT: 0x8C40, //  Unsized sRGB format that leaves the precision up to the driver.
    SRGB_ALPHA_EXT: 0x8C42, //  Unsized sRGB format with unsized alpha component.
    SRGB8_ALPHA8_EXT: 0x8C43, //  Sized (8-bit) sRGB and alpha formats.
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 0x8210, //  Returns the framebuffer color encoding.
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 0x8B8B, //  Indicates the accuracy of the derivative calculation for the GLSL built-in functions: dFdx, dFdy, and fwidth.
    COLOR_ATTACHMENT0_WEBGL: 0x8CE0, //  Framebuffer color attachment point
    COLOR_ATTACHMENT1_WEBGL: 0x8CE1, //  Framebuffer color attachment point
    COLOR_ATTACHMENT2_WEBGL: 0x8CE2, //  Framebuffer color attachment point
    COLOR_ATTACHMENT3_WEBGL: 0x8CE3, //  Framebuffer color attachment point
    COLOR_ATTACHMENT4_WEBGL: 0x8CE4, //  Framebuffer color attachment point
    COLOR_ATTACHMENT5_WEBGL: 0x8CE5, //  Framebuffer color attachment point
    COLOR_ATTACHMENT6_WEBGL: 0x8CE6, //  Framebuffer color attachment point
    COLOR_ATTACHMENT7_WEBGL: 0x8CE7, //  Framebuffer color attachment point
    COLOR_ATTACHMENT8_WEBGL: 0x8CE8, //  Framebuffer color attachment point
    COLOR_ATTACHMENT9_WEBGL: 0x8CE9, //  Framebuffer color attachment point
    COLOR_ATTACHMENT10_WEBGL: 0x8CEA, //  Framebuffer color attachment point
    COLOR_ATTACHMENT11_WEBGL: 0x8CEB, //  Framebuffer color attachment point
    COLOR_ATTACHMENT12_WEBGL: 0x8CEC, //  Framebuffer color attachment point
    COLOR_ATTACHMENT13_WEBGL: 0x8CED, //  Framebuffer color attachment point
    COLOR_ATTACHMENT14_WEBGL: 0x8CEE, //  Framebuffer color attachment point
    COLOR_ATTACHMENT15_WEBGL: 0x8CEF, //  Framebuffer color attachment point
    DRAW_BUFFER0_WEBGL: 0x8825, //  Draw buffer
    DRAW_BUFFER1_WEBGL: 0x8826, //  Draw buffer
    DRAW_BUFFER2_WEBGL: 0x8827, //  Draw buffer
    DRAW_BUFFER3_WEBGL: 0x8828, //  Draw buffer
    DRAW_BUFFER4_WEBGL: 0x8829, //  Draw buffer
    DRAW_BUFFER5_WEBGL: 0x882A, //  Draw buffer
    DRAW_BUFFER6_WEBGL: 0x882B, //  Draw buffer
    DRAW_BUFFER7_WEBGL: 0x882C, //  Draw buffer
    DRAW_BUFFER8_WEBGL: 0x882D, //  Draw buffer
    DRAW_BUFFER9_WEBGL: 0x882E, //  Draw buffer
    DRAW_BUFFER10_WEBGL: 0x882F, //  Draw buffer
    DRAW_BUFFER11_WEBGL: 0x8830, //  Draw buffer
    DRAW_BUFFER12_WEBGL: 0x8831, //  Draw buffer
    DRAW_BUFFER13_WEBGL: 0x8832, //  Draw buffer
    DRAW_BUFFER14_WEBGL: 0x8833, //  Draw buffer
    DRAW_BUFFER15_WEBGL: 0x8834, //  Draw buffer
    MAX_COLOR_ATTACHMENTS_WEBGL: 0x8CDF, //  Maximum number of framebuffer color attachment points
    MAX_DRAW_BUFFERS_WEBGL: 0x8824, //  Maximum number of draw buffers
    VERTEX_ARRAY_BINDING_OES: 0x85B5, //  The bound vertex array object (VAO).
    QUERY_COUNTER_BITS_EXT: 0x8864, //  The number of bits used to hold the query result for the given target.
    CURRENT_QUERY_EXT: 0x8865, //  The currently active query.
    QUERY_RESULT_EXT: 0x8866, //  The query result.
    QUERY_RESULT_AVAILABLE_EXT: 0x8867, //  A Boolean indicating whether or not a query result is available.
    TIME_ELAPSED_EXT: 0x88BF, //  Elapsed time (in nanoseconds).
    TIMESTAMP_EXT: 0x8E28, //  The current time.
    GPU_DISJOINT_EXT: 0x8FBB, //  A Boolean indicating whether or not the GPU performed any disjoint operation.
};